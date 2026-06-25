import { z } from "zod";

export const JobReplyRouterSchema = z.object({
  status: z.enum(["success", "error"]),
  jobId: z.uuid(),
  runId: z.uuid(),
  message: z.string(),
});

export type JobReplyRouterType = z.infer<typeof JobReplyRouterSchema>;
