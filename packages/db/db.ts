import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const dbFileName = process.env.DB_FILE_NAME || "dantes.db";
const sqlite = new Database(dbFileName);

export const db: ReturnType<typeof drizzle> = drizzle({
  client: sqlite,
});
