import { FastifyInstance } from "fastify";
import { job_utils, job_types, db_utils } from "../../packages-tunnel/db.ts";
import { jobReply } from "../../core/types.ts";
import { executable } from "../../index.ts";

export const replyRoute = async (fastify: FastifyInstance) => {
  fastify.post("/", async (req, res) => {
    const reply = req.body as jobReply;

    const foundRunningItem = executable.findRunningItem({ runId: reply.runId });
    if (!foundRunningItem) {
      console.log("Replied as timed out");
      return res
        .status(500)
        .send({ status: "timed_out", message: "Job timed out and recorded" });
    }

    console.log("Replied as not timed out");
    const responseToReply = await executable.onReply(reply);

    if (responseToReply.status == "timed_out") {
      return res.status(500).send(responseToReply);
    }

    if (responseToReply.status == "error") {
      return res.status(500).send(responseToReply);
    }

    return res.status(200).send(responseToReply);
  });
};
