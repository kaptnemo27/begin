import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  schema: "./drizzle/schema",
  dbCredentials: {
    url: "./sqlite.db",
  },
} satisfies Config;
