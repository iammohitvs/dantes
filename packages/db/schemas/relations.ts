import { relations } from "drizzle-orm";
import { JobSchema } from "./Job.ts";
import { QueueSchema } from "./Queue.ts";
import { RunSchema } from "./Run.ts";

export const queueRelations = relations(QueueSchema, ({ many }) => ({
  jobs: many(JobSchema),
}));

export const jobRelations = relations(JobSchema, ({ one }) => ({
  queue: one(QueueSchema, {
    fields: [JobSchema.queueId],
    references: [QueueSchema.id],
  }),
}));

export const runRelations = relations(RunSchema, ({ one }) => ({
  queue: one(QueueSchema, {
    fields: [RunSchema.queueId],
    references: [QueueSchema.id],
  }),
  job: one(JobSchema, {
    fields: [RunSchema.jobId],
    references: [JobSchema.id],
  }),
}));
