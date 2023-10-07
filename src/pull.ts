import { getCari, getProgramStudi, getTingkatPendidikan } from "~/src/utils";
import { db } from "~/drizzle/db";
import { tableSchema } from "~/drizzle/schema";

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

  for (let i = 0; i < listProgramStudi.length; i++) {
    const prodi = listProgramStudi[i];
    const data = (await getCari(prodi))["data"];

    console.log(
      `[${i + 1}/${listProgramStudi.length}] Fetched ${data.length} data from ${
        prodi.nama
      }`,
    );

    if (data.length === 0) continue;

    if (data.length < 1000) {
      await db.insert(tableSchema).values(data).onConflictDoNothing();
      continue;
    }

    for (let i = 0; i < data.length; i += 1000) {
      const chunk = data.slice(i, i + 1000);
      await db.insert(tableSchema).values(chunk).onConflictDoNothing();
    }
  }
};

main();
