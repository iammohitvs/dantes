import { db } from "./db.ts";

const database: {
  db: typeof db;
} = {
  db,
};

export default database;
