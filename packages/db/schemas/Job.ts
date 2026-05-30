import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";
import { QueueSchema } from "./Queue.js";

export const JobSchema = sqliteTable("job", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  payload: text().notNull(),
  response: text(),
  status: text({ enum: ["IDLE", "PENDING", "SUCCESS", "FAILURE"] }),

  ...timestamps,

  queueId: text("queue_id").references(() => QueueSchema.id),
});

export type Job = typeof JobSchema.$inferSelect;
export type NewJob = typeof JobSchema.$inferInsert;
