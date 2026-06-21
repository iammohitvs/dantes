import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { ManyExecutions, SingleExecution } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const createExecution = async (execution: db_utils.NewExecution) => {
  const createdExecutions = await db
    .insert(db_utils.ExecutionSchema)
    .values(execution)
    .returning();

  if (createdExecutions.length) return createdExecutions[0];
  else return null;
};

export const updateExecution = async (
  executionId: string,
  updatedExecutionDetails: {
    jobId?: string;
    runId?: string;
    reply?: string;
    status?: "RUNNING" | "SUCCESS" | "FAILURE" | "TIMED-OUT";
  }
): SingleExecution => {
  const updatedExecutions = await db
    .update(db_utils.ExecutionSchema)
    .set(updatedExecutionDetails)
    .where(eq(db_utils.ExecutionSchema.id, executionId))
    .returning();

  if (updatedExecutions.length) return updatedExecutions[0];
  else return null;
};

export const setExecutionAsRunning = async (executionId: string) => {
  const updatedExecutions = await db
    .update(db_utils.ExecutionSchema)
    .set({ status: "RUNNING" })
    .where(eq(db_utils.ExecutionSchema.id, executionId))
    .returning();

  if (updatedExecutions.length) return updatedExecutions[0];
  else return null;
};

export const setExecutionAsSuccessful = async (
  executionId: string,
  reply: string
) => {
  const updatedExecutions = await db
    .update(db_utils.ExecutionSchema)
    .set({ status: "SUCCESS", reply })
    .where(eq(db_utils.ExecutionSchema.id, executionId))
    .returning();

  if (updatedExecutions.length) return updatedExecutions[0];
  else return null;
};

export const setExecutionAsTimedOut = async (
  executionId: string,
  reply: string
) => {
  const updatedExecutions = await db
    .update(db_utils.ExecutionSchema)
    .set({ status: "TIMED-OUT", reply })
    .where(eq(db_utils.ExecutionSchema.id, executionId))
    .returning();

  if (updatedExecutions.length) return updatedExecutions[0];
  else return null;
};

export const setExecutionAsFailed = async (
  executionId: string,
  reply: string
) => {
  const updatedExecutions = await db
    .update(db_utils.ExecutionSchema)
    .set({ status: "FAILURE", reply })
    .where(eq(db_utils.ExecutionSchema.id, executionId))
    .returning();

  if (updatedExecutions.length) return updatedExecutions[0];
  else return null;
};
