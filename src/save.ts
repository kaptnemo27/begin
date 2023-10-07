import { db } from "~/drizzle/db";
import { tableSchema } from "~/drizzle/schema";
import { saveToCSV, saveToJSON } from "~/src/utils";

const result = await db.select().from(tableSchema);
console.log(`Total data: ${result.length}`);

saveToJSON(result, "data.json").then(() => console.log("Saved to data.json"));
saveToCSV(result, "data.csv").then(() => console.log("Saved to data.csv"));
