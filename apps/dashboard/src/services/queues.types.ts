import { db_utils } from "../packages-tunnel/db";

export type Status = "success" | "error";

export type GetQueues = {
  status: Status;
  queues: db_utils.Queue[];
  queuesCount: number;
};
