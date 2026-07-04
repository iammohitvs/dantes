import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import {
  ManyJobs,
  SingleJob,
  ReturnSingleJobWithQueue,
  ReturnManyJobsWithQueue,
} from "./types.ts";
import { and, eq, lte, isNotNull, isNull } from "drizzle-orm";
import { CronDate, CronExpressionParser } from "cron-parser";

export const getJobByJobId = async (
  jobId: string
): ReturnSingleJobWithQueue => {
  let foundJobs = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId))
    .leftJoin(
      db_utils.QueueSchema,
      eq(db_utils.JobSchema.queueId, db_utils.QueueSchema.id)
    );

  if (foundJobs.length) return foundJobs[0];
  else return null;
};

export const getJobs = async (
  type?: "SINGLE" | "CRON",
  status?:
    | "IDLE"
    | "PENDING"
    | "SUCCESS"
    | "FAILURE"
    | "ERRORED-OUT"
    | "KILLED",
  queueId?: string
): ReturnManyJobsWithQueue => {
  return await db
    .select()
    .from(db_utils.JobSchema)
    .where(
      and(
        type ? eq(db_utils.JobSchema.type, type) : undefined,
        status ? eq(db_utils.JobSchema.status, status) : undefined,
        queueId ? eq(db_utils.JobSchema.queueId, queueId) : undefined
      )
    )
    .leftJoin(
      db_utils.QueueSchema,
      eq(db_utils.JobSchema.queueId, db_utils.QueueSchema.id)
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

export const createJobBulk = async (jobs: db_utils.NewJob[]): ManyJobs => {
  return await db.insert(db_utils.JobSchema).values(jobs).returning();
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

export const pickNextJobToExecute = async (): ReturnSingleJobWithQueue => {
  const currentTimestamp: Date = new Date(Date.now());

  const [chosenCronJobs, chosenScheduledJobs, chosenUnscheduledJobs] =
    await Promise.all([
      db
        .select()
        .from(db_utils.JobSchema)
        .where(
          and(
            eq(db_utils.JobSchema.type, "CRON"),
            eq(db_utils.JobSchema.status, "IDLE"),
            isNotNull(db_utils.JobSchema.nextExecution),
            lte(db_utils.JobSchema.nextExecution, currentTimestamp)
          )
        )
        .leftJoin(
          db_utils.QueueSchema,
          eq(db_utils.JobSchema.queueId, db_utils.QueueSchema.id)
        )
        .orderBy(db_utils.JobSchema.nextExecution),
      db
        .select()
        .from(db_utils.JobSchema)
        .where(
          and(
            eq(db_utils.JobSchema.type, "SINGLE"),
            eq(db_utils.JobSchema.status, "IDLE"),
            isNotNull(db_utils.JobSchema.nextExecution),
            lte(db_utils.JobSchema.nextExecution, currentTimestamp)
          )
        )
        .leftJoin(
          db_utils.QueueSchema,
          eq(db_utils.JobSchema.queueId, db_utils.QueueSchema.id)
        )
        .orderBy(db_utils.JobSchema.nextExecution),
      db
        .select()
        .from(db_utils.JobSchema)
        .where(
          and(
            eq(db_utils.JobSchema.type, "SINGLE"),
            eq(db_utils.JobSchema.status, "IDLE"),
            isNull(db_utils.JobSchema.nextExecution)
          )
        )
        .leftJoin(
          db_utils.QueueSchema,
          eq(db_utils.JobSchema.queueId, db_utils.QueueSchema.id)
        )
        .orderBy(db_utils.JobSchema.createdAt),
    ]);

  if (chosenCronJobs.length) return chosenCronJobs[0];
  if (chosenScheduledJobs.length) return chosenScheduledJobs[0];
  else if (chosenUnscheduledJobs.length) return chosenUnscheduledJobs[0];
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

export const setJobAsFailed = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "FAILURE" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};

export const setJobAsErrored = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "ERRORED-OUT" })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (selectedJobs.length) return selectedJobs[0];
  else return null;
};

export const setJobAsKilled = async (jobId: string): SingleJob => {
  const selectedJobs = await db
    .update(db_utils.JobSchema)
    .set({ status: "KILLED" })
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

export const updateJobRetryCountByOne = async (jobId: string): SingleJob => {
  const fetchedJobs = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId));

  if (!fetchedJobs.length) return null;

  const updatedJobs = await db
    .update(db_utils.JobSchema)
    .set({ currentRetryCount: fetchedJobs[0].currentRetryCount + 1 })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (updatedJobs.length) return updatedJobs[0];
  else return null;
};

export const updateJobNextExecution = async (
  jobId: string,
): SingleJob => {
  const jobsToUpdate = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.id, jobId));

  if (jobsToUpdate.length) {
    if (jobsToUpdate[0].type === "CRON") {
      const nextExecution: CronDate = CronExpressionParser.parse(
        jobsToUpdate[0].cronExpression as string
      ).next();

      console.log(`next execution update: ---- ${nextExecution.toISOString()} ----`);

      const updatedJobs = await db
        .update(db_utils.JobSchema)
        .set({ nextExecution: nextExecution.toDate() })
        .where(eq(db_utils.JobSchema.id, jobId))
        .returning();

      if (updatedJobs.length) return updatedJobs[0];
      else return null;
    } else {
      // This needs to be changed to accomodate exponential backoffs!
      return null;
    }
  } else return null;
};

export const updateJobLastExecution = async (
  jobId: string,
  lastExecution: Date = new Date(Date.now())
): SingleJob => {
  const updatedJobs = await db
    .update(db_utils.JobSchema)
    .set({ lastExecution })
    .where(eq(db_utils.JobSchema.id, jobId))
    .returning();

  if (updatedJobs.length) return updatedJobs[0];
  else return null;
};
