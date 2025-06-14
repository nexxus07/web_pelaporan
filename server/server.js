// Import library
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// Import route pelaporan
import pelaporanRoutes from "./routes/pelaporan.js";

// Konfigurasi environment variable
dotenv.config();

// Inisialisasi app
const app = express();

// Middleware
app.use(cors()); // ✅ Ini digunakan sebelum route
app.use(express.json()); // agar bisa baca body JSON

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Terhubung ke MongoDB Atlas"))
  .catch((err) => console.error("❌ Gagal koneksi ke MongoDB:", err));

// Gunakan route pelaporan
app.use("/api/pelaporan", pelaporanRoutes);

// Route dasar
app.get("/", (req, res) => res.send("SiPelMasD backend berjalan!"));

// Jalankan server
app.listen(4000, () => console.log("🚀 Server on http://localhost:4000"));
