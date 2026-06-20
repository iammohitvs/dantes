import { FastifyInstance } from "fastify";
import {
  db_utils,
  queue_utils,
} from "../../packages-tunnel/db.ts";

export const queueRoute = async (fastify: FastifyInstance) => {
  fastify.post("/", async (req, res) => {
    const queue = req.body as db_utils.NewQueue;

    const createdQueue = await queue_utils.createQueue(queue);

    return res.status(200).send({ queue: createdQueue });
  });
};
