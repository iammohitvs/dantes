import Fastify from "fastify";
import { jobRoute } from "./routes/job.ts";
import { queueRoute } from "./routes/queue.ts";
import { replyRoute } from "./routes/reply.ts";

const PORT = Number(process.env.PORT) || 6969;

export const fastify = Fastify({ logger: true });
export const logger = fastify.log;

fastify.get("/health", (req, res) => {
  res.send({ hello: "world" });
});

fastify.register(jobRoute, { prefix: "/job" });
fastify.register(replyRoute, { prefix: "/reply" });
fastify.register(queueRoute, { prefix: "/queue" });

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info("Process Running on port 6969!! NICE!!");
});
