import * as db_utils from "../../schemas/index.ts";

export type ManyJobs = Promise<db_utils.Job[]>;

export type SingleJob = Promise<db_utils.Job | null>;

export type JobStatus = "IDLE" | "PENDING" | "SUCCESS" | "FAILURE";
export type JobTypeType = "SINGLE" | "CRON";

export type GetJobsType = {
  type?: JobTypeType;
  status?: JobStatus;
  queueId?: string;
};

export type UpdateJobsType = {
  jobId: string;
  type: JobTypeType;
  status: JobStatus;
  queueId: string;
};
