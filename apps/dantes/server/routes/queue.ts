import { FastifyInstance } from "fastify";
import { db_utils, queue_utils } from "../../packages-tunnel/db.ts";

export const queueRoute = async (fastify: FastifyInstance) => {
  fastify.post("/", async (req, res) => {
    const queue = req.body as db_utils.NewQueue;

    const createdQueue = await queue_utils.createQueue(queue);

    if (!createdQueue)
      res.status(404).send({ status: "error", message: "Queue not created" });

    return res.status(200).send({ status: "success", queue: createdQueue });
  });

  fastify.get("/", async (req, res) => {
    const queues = await queue_utils.getAllQueues();

    if (!queues)
      res.status(404).send({ status: "error", message: "Queues not found" });

    return res
      .status(200)
      .send({ status: "success", queues, queuesCount: queues?.length });
  });
};
