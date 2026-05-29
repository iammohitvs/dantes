import { randomUUID } from "crypto";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const QueueSchema = sqliteTable("queue", {
  id: text().$defaultFn(() => randomUUID()).unique().primaryKey().notNull(),
  name: text().unique().notNull(),
});

export const Queue = typeof QueueSchema.$inferSelect;
export const NewQueue = typeof QueueSchema.$inferInsert;
