import { FastifyInstance } from "fastify";

export const jobRoute = async (fastify: FastifyInstance) => {
  fastify.get("/", () => {
    
  });
  
  fastify.get("/:jobId", () => {});
  
  fastify.post("/", () => {});

  fastify.delete("/", () => {});
};
