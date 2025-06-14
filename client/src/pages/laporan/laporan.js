// File: laporan.js
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./laporan.scss";

function FormLaporan() {
  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);

  const [provId, setProvId] = useState("");
  const [kabId, setKabId] = useState("");

  const [formData, setFormData] = useState({
    jenis: "",
    judul: "",
    laporan: "",
    tanggal_kejadian: "",
    tujuan: "",
    kategori: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    status: "belum terlaksana",
  });

  const [preview, setPreview] = useState(false);

  // Ambil data provinsi
  useEffect(() => {
    fetch("/data/provinsi.json")
      .then((res) => res.json())
      .then(setProvinsi)
      .catch(() => setProvinsi([]));
  }, []);

  // Ambil data kabupaten berdasarkan provinsi
  useEffect(() => {
    if (provId) {
      fetch("/data/kabupaten.json")
        .then((res) => res.json())
        .then((data) => {
          setKabupaten(data[provId] || []);
          setFormData((f) => ({
            ...f,
            provinsi: provId,
            kabupaten: "",
            kecamatan: "",
          }));
          setKabId("");
          setKecamatan([]);
        })
        .catch(() => setKabupaten([]));
    } else {
      setKabupaten([]);
      setKabId("");
      setKecamatan([]);
    }
  }, [provId]);

  // Ambil data kecamatan berdasarkan kabupaten
  useEffect(() => {
    if (kabId) {
      fetch("/data/kecamatan.json")
        .then((res) => res.json())
        .then((data) => {
          setKecamatan(data[kabId] || []);
          setFormData((f) => ({ ...f, kabupaten: kabId, kecamatan: "" }));
        })
        .catch(() => setKecamatan([]));
    } else {
      setKecamatan([]);
    }
  }, [kabId]);

  // Menangani perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi mengirim data ke backend (MongoDB Atlas via Express)
  const sendToBackend = async (data) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:4000"
        }/api/pelaporan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            tanggal_kejadian: new Date(data.tanggal_kejadian),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengirim laporan");
      }

      const result = await response.json();
      alert("Laporan berhasil dikirim!\nID: " + result._id);

      // Reset form
      setFormData({
        jenis: "",
        judul: "",
        laporan: "",
        tanggal_kejadian: "",
        tujuan: "",
        kategori: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        status: "belum terlaksana",
      });
      setProvId("");
      setKabId("");
      setKabupaten([]);
      setKecamatan([]);
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim laporan: " + error.message);
    }
  };

  // Menangani submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(true); // Menampilkan preview
    sendToBackend(formData); // Kirim data
  };

  return (
    <div>
      <form className="form-laporan" onSubmit={handleSubmit}>
        <h2>Form Laporan</h2>

        {/* Jenis Laporan */}
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="jenis"
              value="pengaduan"
              onChange={handleChange}
              checked={formData.jenis === "pengaduan"}
            />
            Pengaduan
          </label>
          <label>
            <input
              type="radio"
              name="jenis"
              value="aspirasi"
              onChange={handleChange}
              checked={formData.jenis === "aspirasi"}
            />
            Aspirasi
          </label>
        </div>

        <label>Judul Pelaporan:</label>
        <input
          type="text"
          name="judul"
          value={formData.judul}
          onChange={handleChange}
          required
        />

        <label>Laporan Anda:</label>
        <textarea
          name="laporan"
          value={formData.laporan}
          onChange={handleChange}
          required
        />

        <label>Tanggal Kejadian:</label>
        <input
          type="date"
          name="tanggal_kejadian"
          value={formData.tanggal_kejadian}
          onChange={handleChange}
          required
        />

        <label>Provinsi:</label>
        <select
          value={provId}
          onChange={(e) => setProvId(e.target.value)}
          required
        >
          <option value="">-- Pilih Provinsi --</option>
          {provinsi.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>

        <label>Kabupaten:</label>
        <select
          value={kabId}
          onChange={(e) => setKabId(e.target.value)}
          disabled={!kabupaten.length}
          required
        >
          <option value="">-- Pilih Kabupaten --</option>
          {kabupaten.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </select>

        <label>Kecamatan:</label>
        <select
          name="kecamatan"
          value={formData.kecamatan}
          onChange={handleChange}
          disabled={!kecamatan.length}
          required
        >
          <option value="">-- Pilih Kecamatan --</option>
          {kecamatan.map((kec, idx) => (
            <option key={kec.id || idx} value={kec.nama}>
              {kec.nama}
            </option>
          ))}
        </select>

        <label>Instansi Tujuan:</label>
        <input
          type="text"
          name="tujuan"
          value={formData.tujuan}
          onChange={handleChange}
          required
        />

        <label>Kategori:</label>
        <select
          name="kategori"
          value={formData.kategori}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Kategori --</option>
          <option value="agama">Agama</option>
          <option value="ekonomi_keuangan">Ekonomi dan Keuangan</option>
          <option value="kesehatan">Kesehatan</option>
          <option value="ketentraman">Ketentraman</option>
          <option value="perlindungan">Perlindungan</option>
        </select>

        <button type="submit">Kirim Laporan</button>
      </form>

      {/* Preview laporan */}
      {preview && (
        <div className="preview-laporan">
          <h3>Preview Laporan Anda</h3>
          <div>
            <strong>Judul:</strong> {DOMPurify.sanitize(formData.judul)}
          </div>
          <div>
            <strong>Laporan:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formData.laporan),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FormLaporan;
