import Fastify from "fastify";
import { jobRoute } from "./routes/job.ts";

const PORT = Number(process.env.PORT) || 6969;

export const fastify = Fastify({ logger: true });
export const logger = fastify.log;

// TODO: health will return a version number (like a commit count) every time
// so that the exact version can be tracked after commiting.

fastify.get("/health", (req, res) => {
  res.send({ hello: "world" });
});

fastify.register(jobRoute, { prefix: "/job" });

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info("Process Running on port 6969!! NICE!!");
});
