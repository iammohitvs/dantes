import Fastify from "fastify";
import cors from "@fastify/cors";
import fastify_cookie from "@fastify/cookie";
import { authRoute } from "./routes/auth.ts";
import { jobRoute } from "./routes/job.ts";
import { queueRoute } from "./routes/queue.ts";
import { replyRoute } from "./routes/reply.ts";

const PORT = Number(process.env.PORT) || 6969;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const fastify = Fastify({ logger: true });
export const logger = fastify.log;

const corsOrigin = new URL(FRONTEND_URL).origin;

await fastify.register(cors, { origin: [corsOrigin], credentials: true });
await fastify.register(fastify_cookie);

fastify.get("/health", (req, res) => {
  res.send({ hello: "world" });
});

fastify.register(authRoute, { prefix: "/auth" });
fastify.register(jobRoute, { prefix: "/job" });
fastify.register(queueRoute, { prefix: "/queue" });
fastify.register(replyRoute, { prefix: "/reply" });

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info("Process Running on port 6969!! NICE!!");
});
