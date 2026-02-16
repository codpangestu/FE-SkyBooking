# SkyBooking – Frontend Documentation 🛫
**React (Vite) + Tailwind CSS** • *Last Updated: February 2026*

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Authentication & Access Control](#-authentication--access-control)
- [Routing Structure](#-routing-structure)
- [Tech Stack](#-tech-stack)
- [API Integration](#-api-integration)
- [Component Architecture](#-component-architecture)
- [Responsive Design](#-responsive-design)
- [Deployment Notes](#-deployment-notes)
- [Development Workflow](#-development-workflow)
- [Author](#-author)

---

## 📖 Project Overview
**SkyBooking** adalah platform pencarian dan pemesanan tiket pesawat premium yang dibangun menggunakan **React (Vite)** dan **Tailwind CSS**. Aplikasi ini dirancang dengan estetika modern serta sistem yang sangat dinamis, terintegrasi penuh dengan backend **Laravel REST API**.

**Kemampuan Utama:**
* **Dynamic Booking Flow**: Alur pemesanan multi-step dari pemilihan kelas hingga pembayaran.
* **Interactive Cabin Map**: Denah kursi yang otomatis menyesuaikan kapasitas pesawat dari Admin.
* **Smart Amenities**: Sinkronisasi otomatis fasilitas pesawat (Wifi, Meal, dll) dengan ikon yang adaptif.
* **RBAC**: Kontrol akses berbasis peran (User & Admin).
* **Premium UI**: Desain modern dengan dark theme, glassmorphism, dan animasi halus.

---

## 🚀 Core Features

### 🌍 Public Access (Guest)
* **Landing Page**: Visualisasi hero premium dengan fitur pencarian cepat.
* **Airports Discovery**: Daftar bandara yang didukung oleh sistem.
* **Flight Search**: Pencarian penerbangan real-time berdasarkan rute dan tanggal.
* **Auth**: Pendaftaran identitas (Register) dan verifikasi (Login) yang aman.

### 👤 User Features
* **Select Service Class**: Memilih tingkat kenyamanan dengan visualisasi harga dan manfaat.
* **Interactive Seat Map**: Memilih kursi strategis langsung pada peta kabin pesawat.
* **Booking History**: Melihat riwayat perjalanan yang telah dipesan melalui Profil.
* **State Management**: Data pesanan tetap terjaga selama sesi berlangsung berkat Zustand.

### ⚡ Admin Features
* **Admin Dashboard**: Terintegrasi dengan Laravel Filament untuk monitoring statistik.
* **Flight Management**: Kontrol penuh data penerbangan, pesawat, dan rute.
* **Seat & Class Configuration**: Mengatur kapasitas kursi dan harga setiap kelas layanan.
* **Facility Sync**: Menambahkan fasilitas baru yang otomatis sinkron ke filter frontend.

---

## 🔒 Authentication & Access Control

### Authentication Flow
1.  User login via `/login` menggunakan `useAuthStore`.
2.  Backend mengirimkan `token` (JWT), `user profile`, dan `role`.
3.  Frontend menyimpan state secara reaktif dan persistensi di `localStorage`.
4.  **Axios Interceptor** menyisipkan token secara otomatis ke setiap request header melalui `api.js`.

### Role-Based Access Table
| Role | Izin Akses Halaman |
| :--- | :--- |
| **Guest** | Home, Airports, Login, Register |
| **User** | All Flights, Flight Detail, Seat Selection, Profile, Payment |
| **Admin** | Filament Dashboard, User Management, Flight CRUD |

> **Note:** Proteksi rute menggunakan komponen `<ProtectedRoute />` yang tervalidasi via Zustand.

## 📂 Routing Structure

```text
src/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── AllFlights.jsx
│   ├── FlightClass.jsx
│   ├── FlightSeat.jsx
│   ├── PassengerDetail.jsx
│   ├── Payment.jsx
│   ├── Profile.jsx
│   └── Airports.jsx
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── FlightCard.jsx
│   └── SeatMap.jsx
├── store/
│   ├── useAuthStore.js
│   └── useBookingStore.js
├── services/
│   └── api.js
└── App.jsx
```

---

## 🛠 Tech Stack

* **Framework**: React 18 (Vite)
* **State Management**: Zustand (Reactive State)
* **Styling**: Tailwind CSS (Premium Dark Theme)
* **Routing**: React Router DOM v6
* **HTTP Client**: Axios (with Interceptors)
* **Icons**: Lucide React
* **Auth System**: Laravel Sanctum / JWT
* **Deployment**: Vercel

---

## 🔌 API Integration

**Base URL:**
`VITE_API_URL=https://skybooking-api.production.up.railway.app/api`

### Key Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | Otentikasi Pengguna |
| `GET` | `/flights` | User | Pencarian Penerbangan |
| `GET` | `/flights/{id}` | User | Detail & Manifest Kursi |
| `POST` | `/transactions` | User | Proses Booking & Pembayaran |
| `GET` | `/user` | User | Profil & Riwayat Pesanan |

### Axios Configuration
* **Interceptor**: Menangani penyuntikan `Authorization: Bearer <token>` secara otomatis.
* **Data Mapping**: Menggunakan Laravel API Resources untuk standarisasi struktur data nested (Segments, Facilities).

---

## 📐 Component Architecture

### Reusable Components
* **FlightCard**: Kartu informasi penerbangan dengan mapping ikon fasilitas dinamis.
* **SeatMap**: Komponen interaktif untuk pemilihan kursi berbasis koordinat.
* **ProtectedRoute**: Guard cerdas yang menangani redireksi berdasarkan auth state.

### State Management Logic
* **useBookingStore**: Menyimpan data penerbangan yang dipilih agar tidak hilang saat berpindah tahap pemesanan.
* **useAuthStore**: Pusat kontrol data user dan token login di seluruh aplikasi.

---

## 📱 Responsive Design

* **Mobile**: Grid layout yang tumpuk secara vertikal, menu navigasi slide-out.
* **Tablet**: Penyesuaian ukuran kartu filter dan kolom pencarian.
* **Desktop**: Tampilan dashboard penuh dengan efek glassmorphism lebar.

---

## 📦 Deployment Notes

* **Frontend**: Di-host di **Vercel** dengan konfigurasi `vercel.json` untuk mendukung SPA routing.
* **Environment Variables**: `VITE_API_URL` dikonfigurasi pada dashboard Vercel.
* **Build Command**: `npm run build` yang dioptimalkan oleh Vite.

---

## 🔄 Development Workflow

1.  Ubah fitur atau styling di environment lokal.
2.  Gunakan `npm run dev` untuk preview real-time.
3.  Lakukan **Commit** dan **Push** ke GitHub repository.
4.  Vercel akan mendeteksi perubahan dan melakukan **auto-redeploy**.

---

## 👨‍💻 Author

**Akbar Pangestu** *Fullstack Developer* > "Building scalable and real-world fullstack applications."
