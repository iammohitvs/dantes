import {
  db,
  db_utils,
  execution_utils,
  job_types,
  job_utils,
  queue_utils,
  run_utils,
} from "../packages-tunnel/db.ts";
import {
  FindRunningItemInputType,
  JobReplyExecutable,
  OnReplyReturnType,
} from "./types.ts";
import { apiClient } from "../utils/apiclient.ts";
import { Mutex } from "./Mutex.ts";
import { RunningItem } from "./RunningItem.ts";

export class Executable {
  private MAX_JOB_CONCURRENCY: number =
    Number(process.env.MAX_JOB_CONCURRENCY) || 5;

  private running_items: RunningItem[] = [];
  public running_items_count: number = this.running_items.length || 0;

  private job_selection_mutex: Mutex = new Mutex();

  constructor() {
    console.log("Executable created!");
  }

  public findRunningItem({
    jobId,
    executionId,
    runId,
  }: FindRunningItemInputType): RunningItem | null {
    let found_running_item: RunningItem | null = null;

    if (jobId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.jobId === jobId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    if (executionId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.executionId === executionId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    if (runId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.runId === runId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    return null;
  }

  private async updateJobRetryCountOrSetAsErrored(
    jobId: string
  ): Promise<void> {
    const selectedJob = await job_utils.getJobByJobId(jobId);

    if (!selectedJob) {
      console.warn("No job found to update the retry count");
      return;
    }

    if (!selectedJob.queue) {
      console.warn("No queue found to update the retry count");
      return;
    }

    if (selectedJob.job.currentRetryCount >= selectedJob.queue.retryCount) {
      console.error("Reached max retry count for the job in this queue");
      await job_utils.setJobAsFailed(jobId);
      return;
    }

    await Promise.all([
      job_utils.updateJobRetryCountByOne(jobId),
      job_utils.setJobAsIdle(jobId),
    ]);
  }

  dispatchJob(
    jobId: string,
    runId: string,
    callbackUrl: string,
    payload: string
  ): void {
    apiClient.post(callbackUrl, { runId, payload }).catch(async (err) => {
      await this.onReply({
        jobId,
        runId,
        status: "error",
        message: `Failed at  dispatch: ${err.message}`,
      });
    });
  }

  public async executeNextJob(): Promise<void> {
    if (this.running_items_count >= this.MAX_JOB_CONCURRENCY) {
      console.warn(
        `${this.MAX_JOB_CONCURRENCY}(Maximum deinfed concurrency) jobs already running in parallel`
      );
      return;
    }

    await this.job_selection_mutex.activate();

    let selectedJob: job_types.SingleJobWithQueue | null = null;

    try {
      selectedJob = await job_utils.pickNextJobToExecute();

      if (!selectedJob) {
        console.warn("No IDLE jobs available");
        return;
      }

      if (!selectedJob.queue) {
        console.warn("No queues for the chosen job");
        await job_utils.setJobAsErrored(selectedJob.job.id);
        return;
      }

      const createdExecution = await execution_utils.createExecution({
        jobId: selectedJob.job.id,
        status: "RUNNING",
      });

      if (!createdExecution) {
        console.warn(
          "Error creating a execution instance for this job execution"
        );
        return;
      }

      const runTimeStart = new Date(Date.now());
      const createdRun = await run_utils.createRun({
        executionId: createdExecution.id,
        runTimeStart,
      });

      if (!createdRun) {
        console.warn("Error creating a run instance for this job execution");
        await execution_utils.setExecutionAsFailed(
          createdExecution.id,
          `Failed becuase Run creation failed`
        );
        return;
      }

      await Promise.all([
        execution_utils.updateExecution(createdExecution.id, {
          runId: createdRun.id,
        }),
        job_utils.setJobAsRunning(selectedJob.job.id),
        job_utils.updateJobLastExecution(selectedJob.job.id),
        job_utils.updateJobNextExecution(selectedJob.job.id),
      ]);

      this.dispatchJob(
        selectedJob.job.id,
        createdRun.id,
        selectedJob.queue.callbackUrl,
        selectedJob.job.payload
      );

      this.running_items.push(
        new RunningItem(
          selectedJob.job.id,
          createdExecution.id,
          createdRun.id,
          Number(selectedJob.queue.responseWaitTimeMs)
        )
      );
      this.running_items_count += 1;
    } finally {
      this.job_selection_mutex.deactivate();
    }
    console.log("Job added to the running list: ", selectedJob.job.id);
  }

  public async onReply(reply: JobReplyExecutable): Promise<OnReplyReturnType> {
    let message: string = "";

    const replied_running_item = this.findRunningItem({ runId: reply.runId });

    if (!replied_running_item) {
      message = "Running Item not found";
      return { status: "error", message };
    }

    replied_running_item.clearRunningItemTimeout();
    this.running_items = this.running_items.filter(
      (running_item) => running_item.runId !== reply.runId
    );
    this.running_items_count -= 1;

    const runTimeEnd = new Date(Date.now());

    switch (reply.status) {
      case "success":
        await Promise.all([
          run_utils.updateRun(replied_running_item.runId, {
            isActive: false,
            runTimeEnd,
          }),
          execution_utils.setExecutionAsSuccessful(
            replied_running_item.executionId,
            reply.message
          ),
          job_utils.setJobAsSuccessful(
            reply.jobId || replied_running_item.jobId
          ),
        ]);

        message = "Job set as successful";
        console.log(message);
        return { status: "success", message };

      case "error":
        await Promise.all([
          run_utils.updateRun(replied_running_item.runId, {
            isActive: false,
            runTimeEnd,
          }),
          execution_utils.setExecutionAsFailed(
            replied_running_item.executionId,
            reply.message
          ),
        ]);

        message = "Job errored and recorded";
        console.error(message);

        await this.updateJobRetryCountOrSetAsErrored(
          reply.jobId || replied_running_item.jobId
        );

        return { status: "error", message };

      case "timed_out":
        await Promise.all([
          run_utils.updateRun(replied_running_item.runId, {
            isActive: false,
            runTimeEnd,
          }),
          execution_utils.setExecutionAsTimedOut(
            replied_running_item.executionId,
            reply.message
          ),
        ]);

        message = "Job timed out and recorded";
        console.error(message);

        await this.updateJobRetryCountOrSetAsErrored(
          reply.jobId || replied_running_item.jobId
        );

        return { status: "timed_out", message };

      default:
        message = "Reply neither 'success' nor 'error'";
        console.error(message);
        return { status: "error", message };
    }
  }
}
