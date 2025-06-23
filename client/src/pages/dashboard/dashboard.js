import React from "react";
import "./dashboard.scss";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                
                <h1>Selamat Datang di SiPelMasD</h1>
                <p className="dashboard-desc">
                    <strong>Sistem Pelaporan Masyarakat Digital Desa</strong>
                    <br />
                    <span style={{ color: "#2563EB" }}>
                        Mudah, Cepat, dan Transparan
                    </span>
                    <br /><br />
                    SiPelMasD adalah platform resmi untuk warga dan perangkat desa dalam menyampaikan <b>pengaduan</b> atau <b>aspirasi</b> terkait pelayanan publik, infrastruktur, sosial, dan lainnya.<br />
                    <br />
                    <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: 350, color: "#374151" }}>
                        <li>✅ Laporan Anda langsung diterima perangkat desa</li>
                        <li>✅ Pantau status laporan secara real-time</li>
                        <li>✅ Data Anda aman dan rahasia</li>
                        <li>✅ Dukungan berbagai kategori laporan</li>
                    </ul>
                    <br />
                    
                </p>
                <div className="dashboard-actions">
                    
                    <a href="/login" className="dashboard-btn dashboard-btn-secondary">Login</a>
                    
                </div>
            </div>
        </div>
    );
}

export default Dashboard;