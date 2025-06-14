// File: routes/pelaporan.js
import express from "express";
import Pelaporan from "../models/Pelaporan.js";

const router = express.Router();

// CREATE pelaporan
router.post("/", async (req, res) => {
  try {
    const pelaporan = new Pelaporan(req.body);
    const saved = await pelaporan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ semua pelaporan
router.get("/", async (req, res) => {
  try {
    const all = await Pelaporan.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ satu pelaporan by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Pelaporan.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE pelaporan by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Pelaporan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE pelaporan by ID
router.delete("/:id", async (req, res) => {
  try {
    await Pelaporan.findByIdAndDelete(req.params.id);
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
