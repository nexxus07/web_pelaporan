# SiPelMasD

Sistem Pelaporan Masyarakat Digital (SiPelMasD)  
Aplikasi web untuk pelaporan, aspirasi, dan pengaduan masyarakat secara digital berbasis React & Node.js.

---

## 🚀 Overview

**SiPelMasD** adalah platform pelaporan masyarakat yang memudahkan warga untuk:
- Mengirim pengaduan atau aspirasi ke perangkat desa/instansi terkait
- Melihat status laporan secara real-time
- Mengelola akun pengguna
- Admin dapat mengelola laporan dan data user

Aplikasi terdiri dari dua bagian utama:
- **Frontend**: React (folder `client`)
- **Backend**: Node.js + Express + MongoDB (folder `server`)

---

## 🛠️ Getting Started

### Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:
- [Node.js & npm](https://nodejs.org/) (disarankan versi 16+)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) (atau MongoDB lokal)
- [Firebase Console](https://console.firebase.google.com/) (untuk autentikasi)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/nexxus07/web_pelaporan.git
   cd web_pelaporan
   ```

2. **Setup Backend (Server)**
   ```bash
   cd server
   npm install
   ```
   - Buat file `.env` di folder `server`:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```
   - Jalankan backend:
     ```bash
     npm start
     ```
   - Server berjalan di: [http://localhost:4000](http://localhost:4000)

3. **Setup Frontend (Client)**
   ```bash
   cd ../client
   npm install
   ```
   - Buat file `.env` di folder `client` dan isi dengan konfigurasi Firebase Anda:
     ```
     REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
     REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
     REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
     REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
     REACT_APP_API_URL=http://localhost:4000
     ```
     > **Catatan:**  
     > - Ganti `YOUR_API_KEY` dan lainnya sesuai data dari Firebase Console.
     > - Jangan pernah membagikan API Key Firebase Anda secara publik.
   - Jalankan frontend:
     ```bash
     npm start
     ```
   - Akses aplikasi di: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Firebase Authentication & API Key

Aplikasi ini menggunakan **Firebase Authentication** untuk proses login, register, dan manajemen user.

#### **Langkah Setup Firebase:**

1. **Buat Project di [Firebase Console](https://console.firebase.google.com/)**
2. **Aktifkan Authentication**  
   - Masuk ke menu Authentication → Sign-in method  
   - Aktifkan Email/Password (atau metode lain sesuai kebutuhan)
3. **Dapatkan Konfigurasi Firebase**  
   - Masuk ke Project Settings → General  
   - Salin konfigurasi seperti berikut:
     ```js
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```
4. **Isi file `.env` di folder `client`** (lihat bagian Installation di atas).

---

## ⚡ Penting: Update CACHE_NAME pada Service Worker

Jika Anda melakukan perubahan pada aplikasi (misal: update kode, assets, atau tampilan), **selalu ubah nilai `CACHE_NAME`** di file  
`client/public/service-worker.js`, misalnya dari:
```js
const CACHE_NAME = "pelaporan-cache-v4";
```
menjadi:
```js
const CACHE_NAME = "pelaporan-cache-v5";
```

**Kenapa harus diubah?**  
Karena Service Worker menggunakan nama cache untuk menyimpan file statis aplikasi. Jika `CACHE_NAME` tidak diubah, browser pengguna bisa saja tetap menggunakan cache lama sehingga perubahan pada aplikasi tidak langsung terlihat (user harus hard refresh/Ctrl+F5).  
Dengan mengganti `CACHE_NAME`, cache lama akan dihapus dan diganti dengan cache versi terbaru secara otomatis.

---

## 💡 Usage

- **User**:  
  1. Register akun baru
  2. Login
  3. Buat laporan/aspirasi melalui menu "Buat Laporan"
  4. Lihat status laporan di halaman profil

- **Admin**:  
  1. Login sebagai admin (`/login-admin`)
  2. Kelola laporan dan data user melalui dashboard admin

---

## 👤 Sistem Akun Khusus Admin

Akun admin **berbeda** dengan akun user biasa.  
- **Admin** hanya bisa login melalui halaman `/login-admin`.
- Data admin disimpan di database MongoDB pada koleksi `Admin`.
- Saat pertama kali server dijalankan, sistem akan otomatis membuat akun admin default (misal: `admin@example.com` / `admin123`) jika belum ada.
- Admin login menggunakan email dan password, lalu mendapatkan token autentikasi (JWT) yang digunakan untuk mengakses dashboard admin.
- Setelah login, admin dapat:
  - Melihat, mengedit, dan menghapus data laporan masyarakat
  - Melihat dan menghapus data user
  - Mengubah status laporan (misal: Proses, Sudah Terlaksana)
- Logout admin akan menghapus token dari localStorage dan mengarahkan kembali ke halaman login admin.

> **Keamanan:**  
> Pastikan untuk segera mengganti password admin default setelah deploy ke server produksi.

---

## 🧪 Testing

### Manual Testing

- Jalankan backend dan frontend secara bersamaan
- Coba fitur register, login, buat laporan, dan cek status laporan
- Untuk admin, login di `/login-admin` dan kelola data

### Automated Testing

> Belum tersedia automated test.  
> Anda dapat menambahkan test menggunakan Jest, React Testing Library, atau Supertest untuk backend.

---

## 🌐 Deployment

### Deploy ke Netlify (Frontend)

1. Build aplikasi React:
   ```bash
   npm run build
   ```
2. Deploy folder `client/build` ke Netlify  
   (atau hubungkan repo dan atur publish directory ke `client/build`)

   - Jika menggunakan **Base directory** di Netlify:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `build`

### Deploy Backend

Deploy backend ke layanan seperti Render, Railway, atau VPS.  
Pastikan variabel `REACT_APP_API_URL` di frontend mengarah ke URL backend yang online.

---

## 📚 Struktur Routing (App.js)

Aplikasi menggunakan React Router dan Redux.  
Berikut daftar route utama:

- `/` → Dashboard
- `/login` → Login User
- `/register` → Register User
- `/laporan` → Form Laporan (hanya untuk user login)
- `/user/profile` → Profil & histori laporan user (hanya untuk user login)
- `/login-admin` → Login Admin
- `/admin` → Dashboard Admin

---

## ❓ FAQ

- **Q:** Tidak bisa login/register?  
  **A:** Pastikan backend sudah berjalan dan variabel `.env` sudah benar.

- **Q:** Bagaimana jika ingin reset database?  
  **A:** Hapus data di MongoDB Atlas atau gunakan perintah MongoDB sesuai kebutuhan.

- **Q:** Bagaimana jika ingin ganti logo/nama aplikasi?  
  **A:** Edit file di `client/public/icons/` dan `client/public/manifest.json`.

---

## 📄 License

MIT License

---

> Dokumentasi ini dibuat agar mudah dipahami oleh pemula.  
> Jika ada kendala, silakan buka [Issues](https://github.com/nexxus07/web_pelaporan/issues) di repository ini.