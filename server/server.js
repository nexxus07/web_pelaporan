// Import library
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import route pelaporan & user
import pelaporanRoutes from "./routes/pelaporan.js";
import userRoutes from "./routes/user.js"; // ✅ Tambahkan ini

// Konfigurasi environment variable
dotenv.config();

// Inisialisasi app
const app = express();

// Middleware
app.use(cors()); // ✅ aktifkan CORS
app.use(express.json()); // ✅ parse body JSON

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Terhubung ke MongoDB Atlas"))
  .catch((err) => console.error("❌ Gagal koneksi ke MongoDB:", err));

// Gunakan route pelaporan dan user
app.use("/api/pelaporan", pelaporanRoutes); // Route pelaporan
app.use("/api/user", userRoutes); // ✅ Route user (untuk simpan user Firebase)

// Route dasar
app.get("/", (req, res) => res.send("SiPelMasD backend berjalan!"));

// Jalankan server
app.listen(4000, () => console.log("🚀 Server on http://localhost:4000"));
