import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { ManyJobs, SingleJob } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const getJobByJobId = async (jobId: string): SingleJob => {
  const [foundJob] = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId));

  return foundJob;
};

export const getJobs = async (
  type?: "SINGLE" | "CRON",
  status?: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE",
  queueId?: string
): ManyJobs => {
  return await db
    .select()
    .from(db_utils.JobSchema)
    .where(
      and(
        type ? eq(db_utils.JobSchema.type, type) : undefined,
        status ? eq(db_utils.JobSchema.status, status) : undefined,
        queueId ? eq(db_utils.JobSchema.queueId, queueId) : undefined
      )
    );
};

export const createJob = async (job: db_utils.NewJob): ManyJobs => {
  return await db.insert(db_utils.JobSchema).values(job).returning();
};

export const updateJob = async (
  jobId: string,
  type?: "SINGLE" | "CRON",
  status?: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE",
  queueId?: string
): SingleJob => {
  const updatedJobItems: {
    type?: "SINGLE" | "CRON";
    status?: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE";
    queueId?: string;
  } = {};
  if (type) updatedJobItems["type"] = type;
  if (status) updatedJobItems["status"] = status;
  if (queueId) updatedJobItems["queueId"] = queueId;

  const [updateJob] = await db
    .update(db_utils.JobSchema)
    .set(updatedJobItems)
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  return updateJob;
};

export const deleteJob = async (jobId: string): SingleJob => {
  const [deletedJob] = await db
    .delete(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  return deletedJob;
};
