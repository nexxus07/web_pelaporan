// File: models/Pelaporan.js
import mongoose from "mongoose";

const PelaporanSchema = new mongoose.Schema(
  {
    jenis: {
      type: String,
      enum: ["pengaduan", "aspirasi"],
      required: true,
    },
    judul: {
      type: String,
      required: true,
    },
    laporan: {
      type: String,
      required: true,
    },
    tanggal_kejadian: {
      type: Date,
      required: true,
    },
    provinsi: String,
    kabupaten: String,
    kecamatan: String,
    tujuan: String,
    kategori: String,
    status: {
      type: String,
      default: "belum terlaksana",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pelaporan", PelaporanSchema);
