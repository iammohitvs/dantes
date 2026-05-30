import { db } from "./package-items/db.ts";

console.log(await db.query.JobSchema.findMany())
