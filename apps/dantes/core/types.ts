export interface JobMethodResponseBase {
  status: "success" | "error" | "timed_out";
}

export interface AddJobResponse extends JobMethodResponseBase {
  message: string;
}

export interface JobReplyExecutable extends JobMethodResponseBase {
  jobId: string;
  runId: string;
  message: string;
}

export interface OnReplyReturnType extends JobMethodResponseBase {
  message: string;
}

export interface FindRunningItemInputType {
  jobId?: string;
  executionId?: string;
  runId?: string;
}
