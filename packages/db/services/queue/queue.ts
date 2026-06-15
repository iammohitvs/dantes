import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { ManyQueues, SingleQueue } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const getQueueById = async (queueId: string) => {
  const foundJobs = await db
    .select()
    .from(db_utils.QueueSchema)
    .where(eq(db_utils.QueueSchema.id, queueId));

  if (foundJobs.length) return foundJobs[0];
  else return null;
};

export const createQueue = async (queue: db_utils.NewQueue) => {
  const createdQueues = await db
    .insert(db_utils.QueueSchema)
    .values(queue)
    .returning();

  if (createdQueues) return createdQueues[0];
  else return null;
};
