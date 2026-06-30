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
  status: text({
    enum: [
      "IDLE",
      "PENDING",
      "SUCCESS",
      "FAILURE",
      "ERRORED-OUT",
    ],
  })
    .default("IDLE")
    .notNull(),
  nextExecution: integer("next_execution", { mode: "timestamp" }),
  lastExecution: integer("last_execution", { mode: "timestamp" }),
  executionRecall: text("execution_recall", { mode: "json" }).$type<ExecutionRecall>(),
  currentRetryCount: integer("current_retry_count").default(0).notNull(),

  ...timestamps,

  queueId: text("queue_id")
    .references(() => QueueSchema.id)
    .notNull(),
});

export type Job = typeof JobSchema.$inferSelect;
export type NewJob = typeof JobSchema.$inferInsert;
