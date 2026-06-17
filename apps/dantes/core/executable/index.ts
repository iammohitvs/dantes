import {
  db,
  db_utils,
  execution_utils,
  job_utils,
  queue_utils,
  run_utils,
} from "../../packages-tunnel/db.ts";
import { addJobResponse, jobReply, onReplyReturnType } from "../types.ts";
import { apiClient } from "../../utils/apiclient.ts";

export class Executable {
  private MAX_JOB_CONCURRENCY: number = Number(
    process.env.MAX_JOB_CONCURRENCY!
  );

  private running_items: {
    jobId: string;
    executionId: string;
    runId: string;
  }[] = [];
  public running_items_count: number = this.running_items.length || 0;

  constructor() {
    console.log("Executable created!");
  }

  dispatchJob(jobId: string, callbackUrl: string, payload: string) {
    /* const response =  */ apiClient
      .post(callbackUrl, { jobId, payload })
      .catch(async (err) => {
        await this.onReply({
          jobId,
          status: "error",
          message: `Failed at  dispatch: ${err.message}`,
        });
      });
  }

  public async executeNextJob() {
    if (this.running_items_count >= this.MAX_JOB_CONCURRENCY) {
      console.warn("% jobs already running in parallel");
    }
    const selectedJob = await job_utils.pickNextJobToExecute();

    if (!selectedJob) {
      console.warn("No IDLE jobs available");
      return;
    }

    const callbackUrl = await queue_utils.getQueueCallbackUrl(selectedJob.queueId);

    if (!callbackUrl) {
      console.warn("No callbackUrl for the chosen job");
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

    await execution_utils.updateExecution(
      createdExecution.id,
      undefined,
      createdRun.id
    );

    this.dispatchJob(
      selectedJob.id,
      callbackUrl,
      selectedJob.payload
    );

    await job_utils.setJobAsRunning(selectedJob.id);

    this.running_items.push({
      jobId: selectedJob.id,
      executionId: createdExecution.id,
      runId: createdRun.id,
    });
    this.running_items_count += 1;

    console.log("Job added to the running list: ", selectedJob.id);
  }

  public async onReply(reply: jobReply): Promise<onReplyReturnType> {
    let message: string = "";

    const replied_running_item = this.running_items.find(
      (running_item) => running_item.jobId == reply.jobId
    );

    if (!replied_running_item) {
      message = "Running Item not found";
      return { status: "error", message };
    }

    const runTimeEnd = new Date(Date.now());
    // reduce running items count and remove that running item
    this.running_items.filter(
      (running_item) => running_item.jobId !== reply.jobId
    );
    this.running_items_count -= 1;

    // update an execution
    // update a run

    // an execution must fail thrice, then a job is set as errored

    // if the job fails once/twice, then set it to idle before you chose it to run it again
    switch (reply.status) {
      case "success":
        // update run -> execution -> job
        await run_utils.updateRun(
          replied_running_item.runId,
          false,
          undefined,
          runTimeEnd
        );

        await execution_utils.setExecutionAsSuccessful(
          replied_running_item.executionId,
          reply.message
        );

        await job_utils.setJobAsSuccessful(
          reply.jobId || replied_running_item.jobId
        );

        message = "Job set as successful";
        console.log(message);
        return { status: "success", message };

      case "error":
        await run_utils.updateRun(
          replied_running_item.runId,
          false,
          undefined,
          runTimeEnd
        );

        await execution_utils.setExecutionAsFailed(
          replied_running_item.executionId,
          reply.message
        );

        await job_utils.setJobAsErrored(reply.jobId);

        message = "Job errored and recorded";
        console.error(message);
        return { status: "error", message };

      default:
        message = "Reply neither 'success' nor 'error'";
        console.error(message);
        return { status: "error", message };
    }
  }
}
