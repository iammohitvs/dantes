import type { Job, Queue } from "../packages-tunnel/db";

export type Status = "success" | "error";

export type GetJobs = {
  status: Status;
  jobs: { job: Job; queue: Queue }[];
  jobsCount: number;
};

export type GetJob = {
  status: Status;
  job: { job: Job; queue: Queue };
};
