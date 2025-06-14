import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import './laporan.scss';

function FormLaporan() {
    const [provinsi, setProvinsi] = useState([]);
    const [kabupaten, setKabupaten] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);

    const [provId, setProvId] = useState('');
    const [kabId, setKabId] = useState('');

    const [formData, setFormData] = useState({
        jenis: '',
        judul: '',
        laporan: '',
        tanggal_kejadian: '',
        tujuan: '',
        kategori: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        status: 'belum terlaksana' // tambahkan ini
    });

    const [preview, setPreview] = useState(false);

    // Fetch provinsi saat pertama kali load
    useEffect(() => {
        fetch('/data/provinsi.json')
            .then(res => res.json())
            .then(setProvinsi)
            .catch(() => setProvinsi([]));
    }, []);

    // Fetch kabupaten saat provinsi dipilih
    useEffect(() => {
        if (provId) {
            fetch('/data/kabupaten.json')
                .then(res => res.json())
                .then(data => {
                    setKabupaten(data[provId] || []);
                    setFormData(f => ({ ...f, provinsi: provId, kabupaten: '', kecamatan: '' }));
                    setKabId('');
                    setKecamatan([]);
                })
                .catch(() => setKabupaten([]));
        } else {
            setKabupaten([]);
            setKabId('');
            setKecamatan([]);
        }
    }, [provId]);

    // Fetch kecamatan saat kabupaten dipilih
    useEffect(() => {
        if (kabId) {
            fetch('/data/kecamatan.json')
                .then(res => res.json())
                .then(data => {
                    setKecamatan(data[kabId] || []);
                    setFormData(f => ({ ...f, kabupaten: kabId, kecamatan: '' }));
                })
                .catch(() => setKecamatan([]));
        } else {
            setKecamatan([]);
        }
    }, [kabId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPreview(true); // Tampilkan preview setelah submit
        // Kirim ke backend di sini jika perlu
    };

    return (
        <div>
            <form className="form-laporan" onSubmit={handleSubmit}>
                <h2>Form Laporan</h2>

                {/* Radio Button */}
                <div className="radio-group">
                    <label>
                        <input type="radio" name="jenis" value="pengaduan" onChange={handleChange} checked={formData.jenis === "pengaduan"} />
                        Pengaduan
                    </label>
                    <label>
                        <input type="radio" name="jenis" value="aspirasi" onChange={handleChange} checked={formData.jenis === "aspirasi"} />
                        Aspirasi
                    </label>
                </div>

                <label>Judul Pelaporan:</label>
                <input type="text" id="judul" name="judul" value={formData.judul} onChange={handleChange} required />

                <label>Laporan Anda:</label>
                <textarea id="laporan" name="laporan" value={formData.laporan} onChange={handleChange} required />

                <label>Tanggal Kejadian:</label>
                <input type="date" id="tanggal_kejadian" name="tanggal_kejadian" value={formData.tanggal_kejadian} onChange={handleChange} required />

                <label>Provinsi:</label>
                <select value={provId} onChange={e => setProvId(e.target.value)} required>
                    <option value="">-- Pilih Provinsi --</option>
                    {provinsi.map((p) => (
                        <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                </select>

                <label>Kabupaten:</label>
                <select value={kabId} onChange={e => setKabId(e.target.value)} disabled={!kabupaten.length} required>
                    <option value="">-- Pilih Kabupaten --</option>
                    {kabupaten.map((k) => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                </select>

                <label>Kecamatan:</label>
                <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} disabled={!kecamatan.length} required>
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatan.map((kec, idx) => (
                        <option key={kec.id || idx} value={kec.nama}>{kec.nama}</option>
                    ))}
                </select>

                <label>Instansi Tujuan:</label>
                <input type="text" id="tujuan" name="tujuan" value={formData.tujuan} onChange={handleChange} required />

                <label>Kategori:</label>
                <select name="kategori" id="kategori" value={formData.kategori} onChange={handleChange} required>
                    <option value="">-- Pilih Kategori --</option>
                    <option value="agama">Agama</option>
                    <option value="ekonomi_keuangan">Ekonomi dan Keuangan</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="ketentraman">Ketentraman</option>
                    <option value="perlindungan">Perlindungan</option>
                </select>

                <button type="submit">Kirim Laporan</button>
            </form>

            {/* Preview laporan dengan sanitasi DOMPurify */}
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
                                __html: DOMPurify.sanitize(formData.laporan)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormLaporan;
