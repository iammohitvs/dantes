import {
  db,
  db_utils,
  execution_utils,
  job_utils,
  queue_utils,
  run_utils,
} from "../packages-tunnel/db.ts";
import {
  addJobResponse,
  findRunningItem,
  jobReply,
  onReplyReturnType,
} from "./types.ts";
import { apiClient } from "../utils/apiclient.ts";
import { Mutex } from "./Mutex.ts";
import { RunningItem } from "./RunningItem.ts";

export class Executable {
  private MAX_JOB_CONCURRENCY: number = Number(
    process.env.MAX_JOB_CONCURRENCY!
  );

  private running_items: RunningItem[] = [];
  public running_items_count: number = this.running_items.length || 0;

  private job_selection_mutex: Mutex = new Mutex();

  constructor() {
    console.log("Executable created!");
  }

  findRunningItem({
    jobId,
    executionId,
    runId,
  }: findRunningItem): RunningItem | null {
    let found_running_item: RunningItem | null = null;

    if (jobId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.jobId == jobId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    if (executionId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.executionId == executionId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    if (runId) {
      found_running_item =
        this.running_items.find(
          (running_item) => running_item.runId == runId
        ) || null;
      if (found_running_item) return found_running_item;
    }

    return null;
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

  async initiateRetryJob(jobId: string): Promise<void> {
    const chosenJob = await job_utils.getJobByJobId(jobId);
    if (!chosenJob) {
      console.error("Inside initiateRetry: No job for with this jobId");
      return;
    }
    const chosenQueue = await queue_utils.getQueueById(chosenJob.queueId);
    if (!chosenQueue) {
      console.error("Inside initiateRetry: No queue for with this jobId");
      return;
    }

    if (chosenJob.current_retry_count >= chosenQueue.retry_count) {
      console.error("Reached max retry count for the Queue");
      await job_utils.setJobAsErrored(jobId);
      return;
    }

    console.log(`Retrying job: ${jobId}`);

    const createdExecution = await execution_utils.createExecution({
      jobId,
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
      return;
    }

    await execution_utils.updateExecution(createdExecution.id, {
      runId: createdRun.id,
    });

    await Promise.all([
      job_utils.setJobAsRunning(jobId),
      job_utils.updateJobRetryCountByOne(jobId),
    ]);

    this.dispatchJob(
      jobId,
      createdRun.id,
      chosenQueue.callbackUrl,
      chosenJob.payload
    );

    this.running_items.push(
      new RunningItem(
        jobId,
        createdExecution.id,
        createdRun.id,
        Number(chosenQueue.response_wait_time_ms)
      )
    );
    this.running_items_count += 1;
  }

  public async executeNextJob() {
    if (this.running_items_count >= this.MAX_JOB_CONCURRENCY) {
      console.warn(
        `${this.MAX_JOB_CONCURRENCY}(Maximum deinfed concurrency) jobs already running in parallel`
      );
      return;
    }

    await this.job_selection_mutex.activate();

    let selectedJob: null | db_utils.Job = null;

    try {
      selectedJob = await job_utils.pickNextJobToExecute();

      if (!selectedJob) {
        console.warn("No IDLE jobs available");
        return;
      }

      const chosenQueue = await queue_utils.getQueueById(selectedJob.queueId);

      if (!chosenQueue) {
        console.warn("No queues for the chosen job");
        return;
      }

      const createdExecution = await execution_utils.createExecution({
        jobId: selectedJob.id,
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
        return;
      }

      await execution_utils.updateExecution(createdExecution.id, {
        runId: createdRun.id,
      });

      await job_utils.setJobAsRunning(selectedJob.id);

      this.dispatchJob(
        selectedJob.id,
        createdRun.id,
        chosenQueue.callbackUrl,
        selectedJob.payload
      );

      this.running_items.push(
        new RunningItem(
          selectedJob.id,
          createdExecution.id,
          createdRun.id,
          Number(chosenQueue.response_wait_time_ms)
        )
      );
      this.running_items_count += 1;

      console.log("Job added to the running list: ", selectedJob.id);
    } finally {
      this.job_selection_mutex.deactivate();
    }
  }

  public async onReply(reply: jobReply): Promise<onReplyReturnType> {
    let message: string = "";

    const replied_running_item = this.running_items.find(
      (running_item) => running_item.runId == reply.runId
    );

    if (!replied_running_item) {
      message = "Running Item not found";
      return { status: "error", message };
    }

    const runTimeEnd = new Date(Date.now());
    this.running_items = this.running_items.filter(
      (running_item) => running_item.runId !== reply.runId
    );
    this.running_items_count -= 1;

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

        await this.initiateRetryJob(reply.jobId);

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

        await this.initiateRetryJob(reply.jobId);

        return { status: "timed_out", message };

      default:
        message = "Reply neither 'success' nor 'error'";
        console.error(message);
        return { status: "error", message };
    }
  }
}
