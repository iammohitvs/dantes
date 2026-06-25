import { FastifyInstance, FastifyRequest } from "fastify";
import { job_utils, job_types, db_utils } from "../../packages-tunnel/db.ts";
import { executable } from "../../index.ts";
import { JobReplyRouterSchema, JobReplyRouterType } from "../schemas.ts";
import { OnReplyReturnType } from "../../core/types.ts";

export const replyRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    "/",
    async (req: FastifyRequest<{ Body: JobReplyRouterType }>, res) => {
      const result = JobReplyRouterSchema.safeParse(req.body);

      if (!result.success) {
        return res
          .status(500)
          .send({ status: "error", message: result.error.message });
      }

      const reply = result.data;

      const foundRunningItem = executable.findRunningItem({
        runId: reply.runId,
      });
      if (!foundRunningItem) {
        const foundJob = await job_utils.getJobByJobId(reply.jobId);

        if (!foundJob || !foundJob.queue) {
          return res.status(500).send({
            status: "error",
            message: "Job doesnt exist",
          });
        }

        console.log("Replied as timed out");
        return res.status(500).send({
          status: "timed_out",
          message:
            "Job removed from the current running items (likely timed_out)",
        });
      }

      console.log("Replied as not timed out");
      const responseToReply: OnReplyReturnType = await executable.onReply(
        reply
      );

      if (responseToReply.status === "timed_out") {
        return res.status(500).send(responseToReply);
      }

      if (responseToReply.status === "error") {
        return res.status(500).send(responseToReply);
      }

      return res.status(200).send(responseToReply);
    }
  );
};
