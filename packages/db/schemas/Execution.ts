import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";
import { timestamps } from "./helpers.ts";
import { JobSchema } from "./Job.ts";
import { RunSchema } from "./Run.ts";

export const ExecutionSchema = sqliteTable("execution", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  status: text({ enum: ["IDLE", "RUNNING", "SUCCESS", "FAILURE"] })
    .notNull()
    .default("RUNNING"),
  response: text(),

  ...timestamps,

  jobId: text("job_id").references(() => JobSchema.id),
  runId: text("run_id").references(() => RunSchema.id),
});

// this is the execution reference of a job

export type Execution = typeof ExecutionSchema.$inferSelect;
export type NewExecution = typeof ExecutionSchema.$inferInsert;
