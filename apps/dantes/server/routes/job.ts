import { FastifyInstance } from "fastify";
import { job_utils, job_types, db_utils } from "../../packages-tunnel/db.ts";

export const jobRoute = async (fastify: FastifyInstance) => {
  fastify.get("/", async (req, res) => {
    const { type, status, queueId } = req.query as job_types.GetJobsType;

    const jobs = await job_utils.getJobs(type, status, queueId);

    return res
      .code(200)
      .send({ status: "success", jobs, jobsCount: jobs.length });
  });

  fastify.get("/:jobId", async (req, res) => {
    const { jobId } = req.params as { jobId: string };

    const job = await job_utils.getJobByJobId(jobId);

    if (!job)
      res.status(404).send({ status: "error", message: "Job not found" });

    return res.status(200).send({ status: "success", job });
  });

  fastify.post("/", async (req, res) => {
    const newJobReceived: Record<string, string | number> = req.body as Record<
      string,
      string | number
    >;

    const newJob = {
      ...newJobReceived,
      nextExecution: newJobReceived.nextExecution
        ? new Date(newJobReceived.nextExecution)
        : null,
    } as db_utils.NewJob;

    const createdJob = await job_utils.createJob(newJob);

    if (!createdJob)
      res
        .status(500)
        .send({ status: "error", message: "Error creating your job" });

    return res.status(200).send({ status: "success", createdJob });
  });

  fastify.post("/add-bulk", async (req, res) => {
    const newJobsReceived: Record<string, string | number>[] =
      req.body as Record<string, string | number>[];

    const newJobs: db_utils.NewJob[] = newJobsReceived.map(
      (newJobReceived) =>
        ({
          ...newJobReceived,
          nextExecution: newJobReceived.nextExecution
            ? new Date(newJobReceived.nextExecution)
            : null,
        } as db_utils.NewJob)
    );

    const createdJob = await job_utils.createJobBulk(newJobs);

    if (!createdJob)
      res
        .status(500)
        .send({ status: "error", message: "Error creating your job" });

    return res.status(200).send({ status: "success", createdJob });
  });

  fastify.delete("/:jobId", async (req, res) => {
    const { jobId } = req.params as { jobId: string };

    const deletedJob = await job_utils.deleteJob(jobId);

    if (!deletedJob)
      res
        .status(500)
        .send({ status: "error", message: "Error deleting your job" });

    return res.status(200).send(deletedJob);
  });
};
