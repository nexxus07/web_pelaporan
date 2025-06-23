// Import library
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import xssClean from "xss-clean";
import cookieParser from "cookie-parser";
import csurf from "csurf";

// Import routes
import pelaporanRoutes from "./routes/pelaporan.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js"; // ✅ Tambahkan ini
import Admin from "./models/Admin.js"; // ✅ Import model Admin

// Konfigurasi environment variable
dotenv.config();

// Inisialisasi app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(xssClean());
app.use(cookieParser());

// Aktifkan CSRF protection hanya jika pakai cookie-based auth
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});
// app.use(csrfProtection);

/* ✅ Tambahkan fungsi ini sebelum koneksi */
async function createDefaultAdmin() {
  const existing = await Admin.findOne({
    $or: [{ username: "admin" }, { email: "admin@example.com" }],
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Admin({
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
    });
    await admin.save();
    console.log("✅ Admin default dibuat: admin / admin123");
  } else {
    console.log("ℹ️ Admin default sudah ada");
  }
}

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Terhubung ke MongoDB Atlas");
    await createDefaultAdmin(); // ✅ Panggil di sini
    app.listen(4000, () => console.log("🚀 Server on http://localhost:4000"));
  })
  .catch((err) => console.error("❌ Gagal koneksi ke MongoDB:", err));

// Gunakan routes
app.use("/api/pelaporan", pelaporanRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Route dasar
app.get("/", (req, res) => res.send("SiPelMasD backend berjalan!"));

// Gunakan CSRF hanya untuk route tertentu (misal, jika nanti ada route yang perlu cookie-based auth)
// app.use("/api/some-cookie-route", csrfProtection, someRoute);

// Endpoint untuk mengambil CSRF token (jika memang perlu)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Middleware error CSRF tetap boleh
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next(err);
});


