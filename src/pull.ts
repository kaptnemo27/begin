import { getCari, getProgramStudi, getTingkatPendidikan } from "~/src/utils";
import { db } from "~/drizzle/db";
import { tableSchema } from "~/drizzle/schema";
import { Queue, Worker } from "bullmq";

const getCariQueue = new Queue("getCariQueue");

const main = async () => {
  type ListProgramStudi = Awaited<ReturnType<typeof getProgramStudi>>;
  const listProgramStudi: ListProgramStudi = [];

  const pendidikan = await getTingkatPendidikan();
  for (const p of pendidikan) {
    const prodi = await getProgramStudi(p);

    listProgramStudi.push(...prodi);
  }
  console.log(`Total program studi: ${listProgramStudi.length}`);

  console.log(`Mencari data...`);

  // Create a BullMQ queue for processing getCari tasks

  await getCariQueue.drain();

  for (let i = 0; i < listProgramStudi.length; i++) {
    const prodi = listProgramStudi[i];

    // Enqueue the getCari task with the correct property names
    await getCariQueue.add("getCari", {
      prodi,
      index: i,
      total: listProgramStudi.length,
    });

    console.log(
      `[${i + 1}/${listProgramStudi.length}] Enqueued getCari task for ${
        prodi.nama
      }`,
    );
  }

  // Define a worker to process getCari tasks
  const getCariWorker = new Worker(
    "getCariQueue",
    async (job) => {
      const { prodi, index, total } = job.data; //

      // Fetch data using getCari
      const data = (await getCari(prodi))["data"];

      console.log(
        `[${index + 1}/${total}] Fetched ${data.length} data for ${prodi.nama}`,
      );

      if (data.length === 0) return;

      if (data.length < 1000) {
        db.insert(tableSchema).values(data).onConflictDoNothing();
        return;
      }

      for (let i = 0; i < data.length; i += 1000) {
        const chunk = data.slice(i, i + 1000);
        db.insert(tableSchema).values(chunk).onConflictDoNothing();
      }
    },
    {
      concurrency: 100,
    },
  );

  // Start processing tasks
  await getCariWorker.waitUntilReady();
};

main();
