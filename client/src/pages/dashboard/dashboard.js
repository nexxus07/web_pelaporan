import React from "react";
import "./dashboard.scss";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h1>Selamat Datang di SiPelMasD</h1>
                <p className="dashboard-desc">
                    Sistem Pelaporan Masyarakat Digital<br />
                    Silakan pilih menu di atas untuk melakukan pelaporan, melihat status, atau mengelola akun Anda.
                </p>
                <div className="dashboard-actions">
                    <a href="/laporan" className="dashboard-btn">Buat Laporan</a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;