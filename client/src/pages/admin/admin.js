import React, { useEffect, useState } from "react";
import "./admin.scss";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function Admin() {
  const [tab, setTab] = useState("pelaporans");
  const [pelaporans, setPelaporans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Verifikasi token admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login-admin";
      return;
    }

    fetch(`${API_URL}/api/admin/dashboard`, {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login-admin";
      });
  }, []);

  // Filter state
  const [filter, setFilter] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Proses");

  // Data referensi
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState({});

  // Fetch semua pelaporan (tanpa filter, pakai REST API)
  const fetchPelaporans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/pelaporan`);
      const data = await res.json();
      setPelaporans(data);
    } catch {
      setPelaporans([]);
    }
    setLoading(false);
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user`);
      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  // Fetch data referensi provinsi dan kabupaten
  useEffect(() => {
    fetch("/data/provinsi.json")
      .then((res) => res.json())
      .then(setProvinsiList)
      .catch(() => setProvinsiList([]));
    fetch("/data/kabupaten.json")
      .then((res) => res.json())
      .then(setKabupatenList)
      .catch(() => setKabupatenList({}));
  }, []);

  useEffect(() => {
    if (tab === "pelaporans") fetchPelaporans();
    if (tab === "users") fetchUsers();
    // eslint-disable-next-line
  }, [tab]);

  // Modal open
  const openModal = (id, currentStatus) => {
    setSelectedId(id);
    setSelectedStatus(
      currentStatus === "proses"
        ? "Proses"
        : currentStatus === "sudah terlaksana"
          ? "Sudah Terlaksana"
          : "Proses"
    );
    setShowModal(true);
  };

  // Modal close
  const closeModal = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  // Update status
  const handleUpdateStatus = async () => {
    if (!selectedId) return;
    // Kirim PUT ke backend
    await fetch(`${API_URL}/api/pelaporan/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus.toLowerCase() }),
    });
    closeModal();
    fetchPelaporans();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;
    await fetch(`${API_URL}/api/user/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const getNamaProvinsi = (id) => {
    const prov = provinsiList.find((p) => p.id === id);
    return prov ? prov.nama : id;
  };

  const getNamaKabupaten = (provId, kabId) => {
    const list = kabupatenList[provId] || [];
    const kab = list.find((k) => k.id === kabId);
    return kab ? kab.nama : kabId;
  };

  // Filter function untuk pelaporans
  const filteredPelaporans = pelaporans.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  // Filter function untuk users
  const filteredUsers = users.filter((u) =>
    Object.values(u).join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login-admin";
          }}
        >
          Logout
        </button>
      </div>
      <h2>Admin Panel</h2>
      <div className="nav-tabs">
        <button
          className={tab === "pelaporans" ? "active" : ""}
          onClick={() => {
            setTab("pelaporans");
            setFilter("");
          }}
        >
          Pelaporan
        </button>
        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => {
            setTab("users");
            setFilter("");
          }}
        >
          User
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder={
            tab === "pelaporans"
              ? "Cari pelaporan (judul, jenis, status, provinsi, dll)..."
              : "Cari user (email, uid, dll)..."
          }
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-filter-input"
        />
      </div>

      <div className="tab-content">
        {tab === "pelaporans" && !loading && (
          <table>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Laporan</th>
                <th>Tanggal Kejadian</th>
                <th>Provinsi</th>
                <th>Kabupaten</th>
                <th>Kecamatan</th>
                <th>Tujuan</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Tanggal Input</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPelaporans.map((p) => (
                <tr key={p._id}>
                  <td>{p.judul}</td>
                  <td>{p.jenis}</td>
                  <td>{p.laporan}</td>
                  <td>{new Date(p.tanggal_kejadian).toLocaleDateString()}</td>
                  <td>{getNamaProvinsi(p.provinsi)}</td>
                  <td>{getNamaKabupaten(p.provinsi, p.kabupaten)}</td>
                  <td>{p.kecamatan}</td>
                  <td>{p.tujuan}</td>
                  <td>{p.kategori}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                  </td>
                  <td>
                    <button onClick={() => openModal(p._id, p.status)}>
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPelaporans.length === 0 && (
                <tr>
                  <td colSpan={12}>Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "users" && !loading && (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>UID</th>
                <th>Created At</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.uid}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      style={{
                        background: "#e53935",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4}>Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Modal Update Status */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3>Update Status Pelaporan</h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Proses">Proses</option>
                <option value="Sudah Terlaksana">Sudah Terlaksana</option>
              </select>
              <div style={{ marginTop: 16 }}>
                <button onClick={handleUpdateStatus} style={{ marginRight: 8 }}>
                  Simpan
                </button>
                <button onClick={closeModal}>Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
