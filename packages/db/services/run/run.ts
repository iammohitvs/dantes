import { db } from "../../db.ts";
import * as db_utils from "../../schemas/index.ts";
import { SingleRun } from "./types.ts";
import { and, eq } from "drizzle-orm";

export const createRun = async (run: db_utils.NewRun) => {
  const createdRuns = await db
    .insert(db_utils.RunSchema)
    .values(run)
    .returning();

  if (createdRuns.length) return createdRuns[0];
  else return null;
};

export const updateRun = async (
  runId: string,
  isActive?: boolean,
  runTimeStart?: Date,
  runTimeEnd?: Date
): SingleRun => {
  const updatedRunDetails: {
    isActive?: boolean;
    runTimeStart?: Date;
    runTimeEnd?: Date;
  } = {};

  if (isActive) updatedRunDetails["isActive"] = isActive;
  if (runTimeStart) updatedRunDetails["runTimeStart"] = runTimeStart;
  if (runTimeEnd) updatedRunDetails["runTimeEnd"] = runTimeEnd;

  const updatedRuns = await db
    .update(db_utils.RunSchema)
    .set(updatedRunDetails)
    .where(eq(db_utils.RunSchema.id, runId))
    .returning();

  if (updatedRuns.length) return updatedRuns[0];
  else return null;
};
