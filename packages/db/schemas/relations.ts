import { relations } from "drizzle-orm";
import { JobSchema } from "./Job.ts";
import { QueueSchema } from "./Queue.ts";
import { RunSchema } from "./Run.ts";
import { ExecutionSchema } from "./Execution.ts";

export const queueRelations = relations(QueueSchema, ({ many }) => ({
  jobs: many(JobSchema),
}));

export const jobRelations = relations(JobSchema, ({ one, many }) => ({
  queue: one(QueueSchema, {
    fields: [JobSchema.queueId],
    references: [QueueSchema.id],
  }),
  executions: many(ExecutionSchema),
}));

export const executionRelations = relations(ExecutionSchema, ({ one }) => ({
  job: one(JobSchema, {
    fields: [ExecutionSchema.jobId],
    references: [JobSchema.id],
  }),
}));

export const runRelations = relations(RunSchema, ({ one }) => ({
  execution: one(ExecutionSchema, {
    fields: [RunSchema.executionId],
    references: [ExecutionSchema.id]
  })
}));

