import {
  getCari,
  getProgramStudi,
  getTingkatPendidikan,
  saveToCSV,
  saveToJSON,
} from "~/utils";
import { uniq } from "lodash";

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

  type Result = Awaited<ReturnType<typeof getCari>>["data"];
  const result: Result = [];
  for (let i = 0; i < listProgramStudi.length; i++) {
    const prodi = listProgramStudi[i];
    const data = (await getCari(prodi))["data"];
    result.push(...data);
    console.log(
      `[${i + 1}/${listProgramStudi.length}] Fetched ${data.length} data from ${
        prodi.nama
      }`,
    );
  }

  const filter = uniq(result.map((r) => r.formasi_id));

  console.log(`Total data: ${result.length}`);

  saveToJSON(filter, "data.json");
  saveToCSV(filter, "data.csv");
};

main();
