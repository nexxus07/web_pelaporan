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

export default router;
