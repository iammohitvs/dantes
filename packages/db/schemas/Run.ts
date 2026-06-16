import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";
import { QueueSchema } from "./Queue.js";
import { JobSchema } from "./Job.ts";
import { ExecutionSchema } from "./Execution.ts";

export const RunSchema = sqliteTable("run", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  runTimeStart: integer("run_time_start", { mode: "timestamp" }).notNull(),
  runTimeEnd: integer("run_time_end", { mode: "timestamp" }),

  ...timestamps,

  executionId: text("execution_id").notNull(),
});

export type Run = typeof RunSchema.$inferSelect;
export type NewRun = typeof RunSchema.$inferInsert;
