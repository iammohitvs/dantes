import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";

export const QueueSchema = sqliteTable("queue", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  name: text().unique().notNull(),
  callbackUrl: text("callback_url").notNull(),
  retry_count: integer().default(3).notNull(),

  ...timestamps,
});

export type Queue = typeof QueueSchema.$inferSelect;
export type NewQueue = typeof QueueSchema.$inferInsert;
