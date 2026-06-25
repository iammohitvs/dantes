export interface jobMethodResponseBase {
  status: "success" | "error" | "timed_out";
}

export interface addJobResponse extends jobMethodResponseBase {
  message: string;
}

export interface jobReply extends jobMethodResponseBase {
  jobId: string;
  runId: string;
  message: string;
}

export interface onReplyReturnType extends jobMethodResponseBase {
  message: string;
}

export interface findRunningItemInputType {
  jobId?: string;
  executionId?: string;
  runId?: string;
}
