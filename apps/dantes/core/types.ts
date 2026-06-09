export interface jobMethodResponseBase {
  status: "success" | "error";
}

export interface addJobResponse extends jobMethodResponseBase {
  message: string;
}

export interface jobReply extends jobMethodResponseBase {
  message: string;
  jobId: string;
}
