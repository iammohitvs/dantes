import "./server/index.ts";

import "dotenv/config";

import { db, db_utils, job_utils, queue_utils } from "./packages-tunnel/db.ts";
import { Loop } from "./core/Loop.ts";
import { Executable } from "./core/Executable.ts";

const WAIT_TIME_MS = 1 * 1000; // 1 second

/* const createdQueue = await queue_utils.createQueue({
  name: "Test Queue",
  callbackUrl: "https://localhost:12345/",
});

if (!createdQueue) process.exit();

await job_utils.createJob({
  payload: "Test Job paylaod",
  status: "IDLE",
  queueId: createdQueue.id,
}); */

export const executable = new Executable();

const loop = new Loop(executable, WAIT_TIME_MS, []);

loop.startLoop();
