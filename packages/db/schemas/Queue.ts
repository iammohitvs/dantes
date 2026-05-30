import { randomUUID } from "crypto";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.js";

export const QueueSchema = sqliteTable("queue", {
  id: text()
    .$defaultFn(() => randomUUID())
    .unique()
    .primaryKey()
    .notNull(),
  name: text().unique().notNull(),
  callbackUrl: text("callback_url").notNull(),
  
  ...timestamps,
});

export type Queue = typeof QueueSchema.$inferSelect;
export type NewQueue = typeof QueueSchema.$inferInsert;
