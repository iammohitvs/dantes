import {
  db,
  db_utils,
  job_utils,
  queue_utils,
} from "../../packages-tunnel/db.ts";
import { addJobResponse, jobReply } from "../types.ts";
import { apiClient } from "../../utils/apiclient.ts";

export class Executable {
  private MAX_JOB_CONCURRENCY: number = Number(
    process.env.MAX_JOB_CONCURRENCY!
  );

  private running_items: string[] = [];
  public running_items_count: number = 0;

  constructor() {
    console.log("Executable created!");
  }

  dispatchJob(jobId: string, callbackUrl: string, payload: string) {
    /* const response =  */ apiClient
      .post(callbackUrl, { payload })
      .catch(async (err) => {
        await this.onReply({ jobId, status: "error", message: err.message });
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

    const selectedQueue = await queue_utils.getQueueById(selectedJob.queueId);

    if (!selectedQueue) {
      console.warn("No queue for the chosen job");
      return;
    }

    this.dispatchJob(
      selectedJob.id,
      selectedQueue.callbackUrl,
      selectedJob.payload
    );

    job_utils.setJobAsRunning(selectedJob.id);

    this.running_items.push(selectedJob.id);
    this.running_items_count += 1;

    console.log("Job added to the running list: ", selectedJob.id);
  }

  public async onReply(reply: jobReply): Promise<void> {
    if (reply.status === "error") {
      await job_utils.setJobAsErrored(reply.jobId); // create this util too
      console.log("Job errored and recorded");
      return;
    }

    await job_utils.setJobAsSuccessful(reply.jobId);
    console.log("Job set as successful");
  }
}
