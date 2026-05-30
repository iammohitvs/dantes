import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schemas/index.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbFileName = path.resolve(__dirname, "../../../dantes.db");
const sqlite = new Database(dbFileName);

export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  schema,
});
