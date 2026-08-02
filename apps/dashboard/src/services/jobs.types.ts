import { db_utils } from "../packages-tunnel/db";

export type Status = "success" | "error";

export type GetJobs = {
  status: Status;
  jobs: { job: db_utils.Job; queue: db_utils.Queue }[];
  jobsCount: number;
};

export type GetJob = {
  status: Status;
  job: { job: db_utils.Job; queue: db_utils.Queue };
};
