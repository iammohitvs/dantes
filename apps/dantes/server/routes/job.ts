import { FastifyInstance } from "fastify";
import { job_utils, job_types, db_utils } from "../../packages-tunnel/db.ts";

export const jobRoute = async (fastify: FastifyInstance) => {
  fastify.get("/", async (req, res) => {
    const { type, status, queueId } = req.query as job_types.GetJobsType;

    const jobs = await job_utils.getJobs(type, status, queueId);

    res.code(200).send(jobs);
  });

  fastify.get("/:jobId", async (req, res) => {
    const { jobId } = req.params as { jobId: string };

    const job = await job_utils.getJobByJobId(jobId);

    return res.status(200).send(job);
  });

  fastify.post("/", async (req, res) => {
    const newJob: db_utils.NewJob = req.body as db_utils.NewJob;

    const createdJob = await job_utils.createJob(newJob);

    return res.status(200).send(createdJob);
  });

  fastify.delete("/:jobId", async (req, res) => {
    const { jobId } = req.params as { jobId: string };

    const deletedJob = await job_utils.deleteJob(jobId);

    return res.status(200).send(deletedJob);
  });
};
