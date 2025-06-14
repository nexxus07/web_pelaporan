import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "uid dan email diperlukan" });
  }

  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email });
      await user.save();
    }
    res.status(200).json({ message: "User tersimpan", user });
  } catch (error) {
    res.status(500).json({ error: "Gagal menyimpan user" });
  }
});

// GET semua user
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus user" });
  }
});

export default router;
