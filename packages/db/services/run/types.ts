import * as db_utils from "../../schemas/index.ts";

export type ManyRuns = Promise<db_utils.Run[]>;

export type SingleRun = Promise<db_utils.Run | null>;
