import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";

const default_reply_wait_time =
  String(process.env.DEFAULT_REPLY_WAIT_TIME) || "600000";

export const QueueSchema = sqliteTable("queue", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  name: text().unique().notNull(),
  callbackUrl: text("callback_url").notNull(),
  retry_count: integer().default(3).notNull(),
  response_wait_time_ms: text().default(default_reply_wait_time).notNull(),

  ...timestamps,
});

export type Queue = typeof QueueSchema.$inferSelect;
export type NewQueue = typeof QueueSchema.$inferInsert;
