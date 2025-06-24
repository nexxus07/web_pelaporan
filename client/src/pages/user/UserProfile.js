import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ambil profil user
        const profile = {
          nama: user.displayName,
          email: user.email,
          uid: user.uid,
          foto: user.photoURL,
        };
        localStorage.setItem("cachedUserProfile", JSON.stringify(profile));
        setUserData(profile);

        // Ambil cache histori laporan (kalau ada)
        const cached = localStorage.getItem("cachedLaporan");
        if (cached) {
          setLaporan(JSON.parse(cached));
          setLoading(false);
        }

        // Fetch terbaru dari server (jika online)
        if (navigator.onLine) {
          try {
            const res = await fetch(
              `${
                process.env.REACT_APP_API_URL || "http://localhost:4000"
              }/api/pelaporan/user/${user.uid}`
            );
            if (!res.ok) throw new Error("Gagal fetch data dari server");
            const data = await res.json();
            setLaporan(data);
            localStorage.setItem("cachedLaporan", JSON.stringify(data));
          } catch (err) {
            console.error("Gagal fetch laporan:", err.message);
          }
        }

        setLoading(false);
      } else {
        // Tidak ada user login → coba dari cache
        const cachedProfile = localStorage.getItem("cachedUserProfile");
        if (cachedProfile) setUserData(JSON.parse(cachedProfile));

        const cachedLaporan = localStorage.getItem("cachedLaporan");
        if (cachedLaporan) setLaporan(JSON.parse(cachedLaporan));

        setLoading(false);
      }
    });

    // Update status offline/online secara realtime
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!userData && loading)
    return <p style={{ padding: "20px" }}>Memuat profil...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {isOffline && (
        <p
          style={{
            background: "#ffe0e0",
            padding: "10px",
            borderRadius: "8px",
            color: "#b30000",
          }}
        >
          ⚠️ Kamu sedang offline. Data yang ditampilkan berasal dari cache.
        </p>
      )}

      {/* === USER PROFILE === */}
      <h2>Profil Pengguna</h2>
      <p>
        <strong>Nama:</strong> {userData?.nama || "(tidak tersedia)"}
      </p>
      <p>
        <strong>Email:</strong> {userData?.email}
      </p>
      <p>
        <strong>User ID:</strong> {userData?.uid}
      </p>

      <hr style={{ margin: "30px 0" }} />

      {/* === HISTORI LAPORAN === */}
      <h2>Histori Laporan Anda</h2>
      {loading ? (
        <p>Memuat data laporan...</p>
      ) : laporan.length === 0 ? (
        <p>Belum ada laporan yang dikirim.</p>
      ) : (
        <ul>
          {laporan.map((lapor) => (
            <li key={lapor._id} style={{ marginBottom: "16px" }}>
              <strong>{lapor.judul}</strong>
              <br />
              <span>
                {lapor.kategori} - {lapor.status}
              </span>
              <br />
              <small>
                Tanggal Kejadian:{" "}
                {new Date(lapor.tanggal_kejadian).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfile;
