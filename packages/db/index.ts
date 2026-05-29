import { db } from "./db.js";

const database: {
  db: typeof db;
} = {
  db,
};

export default database;
