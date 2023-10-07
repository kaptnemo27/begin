CREATE TABLE `table` (
	`formasi_id` text,
	`ins_kd` text,
	`ins_nm` text,
	`pengadaan_kd` text,
	`jp_nama` text,
	`formasi_nm` text,
	`jabatan_kd` text,
	`jabatan_nm` text,
	`lokasi_nm` text,
	`pendidikan_nm` text,
	`gaji_min` text,
	`gaji_max` text,
	`jumlah_formasi` text,
	`disable` text,
	`group_tk_pendidikan_id` text,
	`kode_ref_pend` text,
	`instansi_id` text,
	`jenis_formasi_id` text,
	`aksi` text,
	`pendidikan_nm_split` text,
	`kode_ref_pend_split` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `table_formasi_id_unique` ON `table` (`formasi_id`);