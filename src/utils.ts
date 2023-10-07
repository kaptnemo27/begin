import queryString from "query-string";
import z from "zod";
import { json2csv } from "json-2-csv";

export const getTingkatPendidikan = async () => {
  const resp = await fetch("https://sscasn.bkn.go.id/actionGetTkPend", {
    method: "POST",
  });

  const schema = z
    .array(
      z.object({
        group_tk_pendidikan_id: z.string(),
        nama: z.string(),
      }),
    )
    .min(1, "Tingkat pendidikan tidak ditemukan");

  const data = schema.parse(await resp.json());

  return data;
};

type getProgramStudiProps = Awaited<
  ReturnType<typeof getTingkatPendidikan>
>[number];

export const getProgramStudi = async (props: getProgramStudiProps) => {
  const resp = await fetch(
    `https://sscasn.bkn.go.id/actionTkPend/${props.group_tk_pendidikan_id}`,
    {
      method: "POST",
      body: queryString.stringify({
        tingkatPendidikan_id: props.group_tk_pendidikan_id,
        pendidikan_id: props.group_tk_pendidikan_id,
        action: "get_pendidikan",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const schema = z
    .array(
      z
        .object({ pendidikan_id: z.string(), nama: z.string() })
        .transform((data) => {
          return {
            ...data,
            tingkatPendidikan_id: props.group_tk_pendidikan_id,
          };
        }),
    )
    .min(1, "Program studi tidak ditemukan");

  const data = schema.parse(await resp.json());

  return data;
};

type getCariProps = Awaited<ReturnType<typeof getProgramStudi>>[number];

export const getCari = async (props: getCariProps) => {
  const resp = await fetch("https://sscasn.bkn.go.id/actionCariBuilder", {
    method: "POST",
    body: queryString.stringify({
      draw: 1,
      start: 0,
      length: 1000000,
      tp: props.tingkatPendidikan_id,
      pen: props.pendidikan_id,
      "columns[0][data]": "",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const schema = z.object({
    data: z.array(
      z
        .object({
          formasi_id: z.string(),
          ins_kd: z.string(),
          ins_nm: z.string(),
          pengadaan_kd: z.string(),
          jp_nama: z.string(),
          formasi_nm: z.string(),
          jabatan_kd: z.string(),
          jabatan_nm: z.string(),
          lokasi_nm: z.string(),
          pendidikan_nm: z.string(),
          gaji_min: z.string().nullable(),
          gaji_max: z.string().nullable(),
          jumlah_formasi: z.string(),
          disable: z.string(),
          group_tk_pendidikan_id: z.string(),
          kode_ref_pend: z.string(),
          instansi_id: z.string(),
          jenis_formasi_id: z.string(),
          aksi: z.string(),
        })
        .transform((data) => {
          return {
            ...data,
            pendidikan_nm_split: data.pendidikan_nm.split(" / "),
            kode_ref_pend_split: data.kode_ref_pend.split(" / "),
          };
        }),
    ),
  });

  const parse = schema.safeParse(await resp.json());

  if (!parse.success) {
    throw new Error(
      `Error parsing getCari, tingkatPendidikan_id: ${props.tingkatPendidikan_id}, pendidikan_id: ${props.pendidikan_id}, pendidian_nm: ${props.nama} dengan error: ${parse.error.message}`,
    );
  }

  return parse.data;
};

export const saveToJSON = async (data: any, filename: string) => {
  Bun.write(filename, JSON.stringify(data, null, 2));
};

export const saveToCSV = async (data: any, filename: string) => {
  const csv = await json2csv(data);
  Bun.write(filename, csv);
};
