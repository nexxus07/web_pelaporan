import mongoose from "mongoose";

const pelaporanSchema = new mongoose.Schema(
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
    lokasi: {
      type: String, // nanti bisa dikembangkan ke koordinat
      required: true,
    },
    tujuan: {
      type: String,
      required: true,
    },
    kategori: {
      type: String,
      enum: [
        "agama",
        "ekonomi_keuangan",
        "kesehatan",
        "ketentraman",
        "perlindungan",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pelaporan = mongoose.model("Pelaporan", pelaporanSchema);
export default Pelaporan;
