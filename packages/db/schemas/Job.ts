import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";
import { QueueSchema } from "./Queue.js";

export type ExecutionRecall = Date[];

export const JobSchema = sqliteTable("job", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  payload: text().notNull(),
  type: text({ enum: ["SINGLE", "CRON"] })
    .default("SINGLE")
    .notNull(),
  status: text({ enum: ["IDLE", "PENDING", "SUCCESS", "FAILURE"] }).notNull(),
  next_execution: integer({ mode: "timestamp" }),
  last_execution: integer({ mode: "timestamp" }),
  execution_recall: text({ mode: "json" }).$type<ExecutionRecall>(),

  ...timestamps,

  queueId: text("queue_id").references(() => QueueSchema.id),
});

export type Job = typeof JobSchema.$inferSelect;
export type NewJob = typeof JobSchema.$inferInsert;
