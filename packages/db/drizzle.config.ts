import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schemas/*",
  dialect: "sqlite",
  dbCredentials: {
    url: "../../dantes.db",
  },
});
