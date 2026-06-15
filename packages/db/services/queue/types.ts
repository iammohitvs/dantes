import * as db_utils from "../../schemas/index.ts";

export type ManyQueues = Promise<db_utils.Queue[] | null>;

export type SingleQueue = Promise<db_utils.Queue | null>;
