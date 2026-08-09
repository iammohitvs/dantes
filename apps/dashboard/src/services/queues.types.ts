import type { Queue } from "../packages-tunnel/db";

export type Status = "success" | "error";

export type GetQueues = {
  status: Status;
  queues: Queue[];
  queuesCount: number;
};
