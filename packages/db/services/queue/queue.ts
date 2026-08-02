import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { ManyQueues, SingleQueue } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const getQueueById = async (queueId: string): SingleQueue => {
  const foundJobs = await db
    .select()
    .from(db_utils.QueueSchema)
    .where(eq(db_utils.QueueSchema.id, queueId));

  if (foundJobs.length) return foundJobs[0];
  else return null;
};

export const getAllQueues = async (): ManyQueues => {
  const foundQueues = await db.select().from(db_utils.QueueSchema);

  if (foundQueues.length) return foundQueues;
  else return null;
};

export const getQueueCallbackUrl = async (
  queueId: string
): Promise<string | null> => {
  const foundJobs = await db
    .select({ callbackUrl: db_utils.QueueSchema.callbackUrl })
    .from(db_utils.QueueSchema)
    .where(eq(db_utils.QueueSchema.id, queueId));

  if (foundJobs.length) return foundJobs[0].callbackUrl;
  else return null;
};

export const createQueue = async (queue: db_utils.NewQueue): SingleQueue => {
  const createdQueues = await db
    .insert(db_utils.QueueSchema)
    .values(queue)
    .returning();

  if (createdQueues.length) return createdQueues[0];
  else return null;
};
