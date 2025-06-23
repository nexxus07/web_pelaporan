import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER ADMIN (gunakan hanya sekali lalu hapus atau lindungi!)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin terdaftar" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mendaftar admin" });
  }
});

// LOGIN ADMIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Gagal login" });
  }
});

// MIDDLEWARE PROTEKSI
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(403).json({ error: "Token tidak ditemukan" });

  // Ambil token setelah "Bearer "
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
};

// CEK DASHBOARD
router.get("/dashboard", verifyToken, async (req, res) => {
  const admin = await Admin.findById(req.adminId);
  if (!admin) return res.status(403).json({ error: "Akses ditolak" });

  res.status(200).json({ message: "Verifikasi berhasil", admin });
});

export default router;
