import { drizzle_orm } from "@packages/db";
import { db, db_utils } from "../../packages-tunnel/db.ts";
import { addJobResponse, jobReply } from "../types.ts";

const { eq } = drizzle_orm;

const pickNextJobToExecute = async () => {
  const job = await db
    .select()
    .from(db_utils.JobSchema)
    .where(eq(db_utils.JobSchema.status, "IDLE"));

  return job;
};

const createJob = async (job: db_utils.NewJob) => {
  const newJob = await db.insert(db_utils.JobSchema).values(job);

  return newJob;
};

export class Executable {
  private running_items: string[] = [];
  public running_items_count: number = 0;

  constructor() {
    console.log("Executable created!");
  }

  public async executeNextJob() {
    console.log(await pickNextJobToExecute());
  }

  public async addJob(job: db_utils.NewJob): Promise<addJobResponse> {
    if (this.running_items_count == 5) {
      return {
        status: "error",
        message: "Limit of concurrent running job already reached",
      };
    }
    /* const addedJob: db_utils.Job = await createJob(); */ // create this funtion in db_utils as helper utils or somehting

    // this.running_items.push(addedJob.id);
    this.running_items_count += 1;

    return {
      status: "success",
      message: "Job added successfully",
    };
  }

  public async onReply(reply: jobReply): Promise<void> {
    /* if (reply.status === "error") {
      await setJobAsErrored(reply.jobId); // create this util too
      console.log("Job errored and recorded");
      return;
    }

    await setJobAsSuccessful(reply.jobId);
    console.log("Job set as successful"); */
  }
}
