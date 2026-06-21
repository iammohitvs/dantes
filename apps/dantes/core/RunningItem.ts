import { executable } from "../index.ts";

const default_reply_wait_time =
  String(process.env.DEFAULT_REPLY_WAIT_TIME) || "600000";

export class RunningItem {
  public jobId: string;
  public executionId: string;
  public runId: string;

  public reply_waiting_timer: NodeJS.Timeout | null = null;

  constructor(
    jobId: string,
    executionId: string,
    runId: string,
    replyWaitingTime?: number
  ) {
    this.jobId = jobId;
    this.executionId = executionId;
    this.runId = runId;

    this.reply_waiting_timer = setTimeout(async () => {
      await executable.onReply({
        jobId: this.jobId as string,
        message: "Reply Timed out",
        status: "timed_out",
      });
    }, Number(replyWaitingTime || default_reply_wait_time));
  }
}
