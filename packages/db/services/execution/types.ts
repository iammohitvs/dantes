import * as db_utils from "../../schemas/index.ts";

export type ManyExecutions = Promise<db_utils.Execution[]>;

export type SingleExecution = Promise<db_utils.Execution | null>;

export type ExecutionStatus = "IDLE" | "RUNNING" | "SUCCESS" | "FAILURE";
