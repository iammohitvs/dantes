import { FastifyInstance } from "fastify";
import { job_utils, job_types, db_utils } from "../../packages-tunnel/db.ts";
import { jobReply } from "../../core/types.ts";
import { executable } from "../../index.ts";

export const replyRoute = async (fastify: FastifyInstance) => {
  fastify.post("/", async (req, res) => {
    const reply = req.body as jobReply;

    const responseToReply = await executable.onReply(reply);

    if (responseToReply.status == "error") {
      return res.status(500).send(responseToReply);
    }

    return res.status(200).send(responseToReply);
  });
};
