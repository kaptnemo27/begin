import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "~/drizzle/db";

const main = async () => {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
};

main()
  .then(() => {
    console.log("Migration done");
  })
  .catch((e) => {
    console.error(`Migration failed: ${e.message}`);
  });
