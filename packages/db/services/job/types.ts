import * as db_utils from "../../schemas/index.ts";

export type ManyJobs = Promise<db_utils.Job[]>;

export type SingleJob = Promise<db_utils.Job>;

export type GetJobsType = {
  type?: "SINGLE" | "CRON";
  status?: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE";
  queueId?: string;
};

export type UpdateJobsType = {
  jobId: string;
  type: "SINGLE" | "CRON";
  status: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE";
  queueId: string;
};
