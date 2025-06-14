import express from "express";
import Pelaporan from "../models/Pelaporan.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const data = new Pelaporan(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const semuaPelaporan = await Pelaporan.find().sort({ createdAt: -1 });
    res.json(semuaPelaporan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID
router.get("/:id", async (req, res) => {
  try {
    const pelaporan = await Pelaporan.findById(req.params.id);
    if (!pelaporan)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(pelaporan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Pelaporan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Pelaporan.findByIdAndDelete(req.params.id);
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
