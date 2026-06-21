import { defineConfig } from "drizzle-kit";

const db_file_path = String(process.env.DB_FILE_PATH) || "../../dantes.db";

export default defineConfig({
  schema: "./schemas/*",
  dialect: "sqlite",
  dbCredentials: {
    url: db_file_path,
  },
});
