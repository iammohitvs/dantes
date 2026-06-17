import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { ManyJobs, SingleJob } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const getJobByJobId = async (jobId: string): SingleJob => {
  const foundJobs = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId));

  if (foundJobs.length) return foundJobs[0];
  else return null;
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

export const createJob = async (job: db_utils.NewJob): SingleJob => {
  const createdJobs = await db
    .insert(db_utils.JobSchema)
    .values(job)
    .returning();

  if (createdJobs) return createdJobs[0];
  else return null;
};

export const updateJob = async (
  jobId: string,
  updatedJobItems: {
    type?: "SINGLE" | "CRON";
    status?: "IDLE" | "PENDING" | "SUCCESS" | "FAILURE";
    queueId?: string;
  }
): SingleJob => {
  const updateJobs = await db
    .update(db_utils.JobSchema)
    .set(updatedJobItems)
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (updateJobs.length) return updateJobs[0];
  else return null;
};

export const deleteJob = async (jobId: string): SingleJob => {
  const deletedJobs = await db
    .delete(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (deletedJobs.length) return deletedJobs[0];
  else return null;
};

export const pickNextJobToExecute = async (): SingleJob => {
  const chosenJobs = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.status, "IDLE"))
    .orderBy(db_utils.JobSchema.createdAt);

  if (chosenJobs.length) return chosenJobs[0];
  else return null;
};

export const setJobAsRunning = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "PENDING" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};

export const setJobAsSuccessful = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "SUCCESS" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};

export const setJobAsErrored = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "FAILURE" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};

export const setJobAsIdle = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "IDLE" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};
