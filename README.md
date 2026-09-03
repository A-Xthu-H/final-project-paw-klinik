# Aplikasi Web Klinik

Aplikasi informasi Klinik Sehat Sentosa dengan landing page publik, chatbot
RAG berbasis Gemini, manajemen dokter dan jadwal, knowledge base, serta
appointment pasien melalui form maupun chatbot.

## Fitur Utama

- Landing page klinik responsif untuk desktop dan mobile.
- Chatbot publik 24/7 tanpa login.
- Semantic retrieval menggunakan Gemini Embedding dan cosine similarity.
- Gemini Generation dengan fallback TF-IDF dan jawaban berbasis dokumen.
- Login admin dan pasien menggunakan bcrypt serta JWT.
- CRUD dokter, jadwal praktik, dan knowledge base.
- Booking appointment manual dan melalui chatbot.
- Validasi hari praktik, jam praktik, kuota, dan bentrok jadwal.
- Manajemen status appointment oleh admin.
- Penyimpanan ChatHistory berdasarkan session.
- SQLite sebagai database aplikasi.

## Struktur Project

```
final-project-paw-klinik/
├── backend/
│   ├── controllers/       # Logic auth, clinic API, chatbot, dan health check
│   ├── data/              # Knowledge base klinik
│   ├── middleware/        # JWT dan role protection
│   ├── routes/            # Route API Express
│   ├── services/          # Service retrieval RAG
│   ├── test/              # Automated API tests
│   ├── db.js              # Schema dan seed SQLite
│   └── app.js             # Entry point backend
├── frontend/
│   └── src/
│       ├── components/    # Komponen UI reusable
│       ├── hooks/         # Logic API dan state React
│       ├── pages/         # Halaman publik, admin, dan pasien
│       ├── routes/        # Definisi route React
│       └── utils/         # API client
├── PRD-Klinik-Kelompok-5.md
└── README.md
```

## Prasyarat

- Node.js 18 atau lebih baru.
- npm.
- API key Gemini untuk mengaktifkan embedding dan generation.

## Instalasi

### 1. Backend

PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
npm install
```

Buka `backend/.env`, lalu isi konfigurasi berikut:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ganti-dengan-secret-minimal-32-karakter
JWT_EXPIRES_IN=8h
GEMINI_API_KEY=isi-api-key-gemini
GEMINI_MODEL=gemini-3.6-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```

`backend/.env` tidak boleh di-commit. Database SQLite akan dibuat otomatis
saat backend pertama kali dijalankan.

### 2. Frontend

Buka terminal kedua:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
```

Pastikan `frontend/.env` berisi:

```env
VITE_API_URL=http://localhost:3000
```

## Menjalankan Aplikasi

### Terminal 1: Backend

```powershell
cd backend
npm run dev
```

Backend tersedia di `http://localhost:3000`.

### Terminal 2: Frontend

```powershell
cd frontend
npm run dev
```

Frontend tersedia di `http://localhost:5173`.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@klinik.com` | `admin123` |
| Pasien | `pasien@klinik.com` | `pasien123` |

## Automated Test

Jalankan dari folder `backend`:

```powershell
cd backend
npm test
```

Test mencakup health check, login JWT, proteksi role, chatbot fallback,
ChatHistory, endpoint jadwal, dan validasi tanggal appointment.

## Build Frontend

```powershell
cd frontend
npm run build
```

## Alur Testing Presentasi

1. Jalankan backend dan frontend sesuai instruksi di atas.
2. Buka landing page dan pastikan status backend aktif.
3. Buka chatbot tanpa login.
4. Klik template `Jam operasional klinik` atau `Jadwal dokter hari ini`.
5. Tanyakan informasi layanan, prosedur, BPJS, atau fasilitas klinik.
6. Uji pertanyaan yang tidak tersedia dan pastikan fallback muncul.
7. Login sebagai admin menggunakan akun demo.
8. Tambahkan atau ubah data dokter, jadwal, dan knowledge base.
9. Buka chatbot dan pastikan perubahan data terbaca.
10. Login sebagai pasien menggunakan akun demo.
11. Buat appointment melalui form pasien.
12. Buka chatbot, pilih `Saya ingin membuat appointment`, lalu buat appointment melalui chat.
13. Login kembali sebagai admin dan pastikan appointment tampil dengan sumber `form` atau `chat`.
14. Ubah status appointment menjadi dikonfirmasi, selesai, atau dibatalkan.
15. Uji validasi tanggal yang tidak sesuai hari praktik, jam di luar jadwal, dan jadwal bentrok.
16. Buka browser DevTools dalam mode mobile 375px atau 390px untuk menguji landing page, chatbot, tabel, dan modal.
17. Jalankan `npm test` dan `npm run build` sebagai validasi akhir.

## Endpoint Utama

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/health` | Publik |
| POST | `/api/auth/admin/login` | Publik |
| POST | `/api/auth/pasien/login` | Publik |
| GET | `/api/doctors` | Publik |
| GET | `/api/schedules` | Publik |
| GET | `/api/knowledge` | Publik |
| POST | `/api/chat` | Publik/pasien untuk booking |
| GET | `/api/chat/history/:sessionId` | Publik |
| POST/PUT/DELETE | `/api/doctors` | Admin |
| POST/PUT/DELETE | `/api/schedules` | Admin |
| POST/PUT/DELETE | `/api/knowledge` | Admin |
| GET | `/api/appointments` | Admin |
| PATCH | `/api/appointments/:id/status` atau `/api/appointments/:id/reschedule` | Admin |
| GET | `/api/appointments/mine` | Pasien |
| POST | `/api/appointments` | Pasien |

Endpoint terlindungi menggunakan header:

```text
Authorization: Bearer <JWT>
```

## Troubleshooting

- **Backend tidak terdeteksi:** pastikan backend berjalan di port 3000 dan
   `VITE_API_URL` mengarah ke `http://localhost:3000`.
- **CORS error:** jalankan frontend pada port 5173 atau sesuaikan
   `FRONTEND_URL` di `backend/.env`.
- **Gemini fallback:** pastikan `GEMINI_API_KEY` benar dan model Gemini masih
   tersedia. Tanpa Gemini, fallback TF-IDF tetap digunakan.
- **Database kosong:** hapus `backend/klinik.sqlite`, lalu jalankan backend
   kembali agar schema dan seed dibuat ulang.
- **Production:** isi `JWT_SECRET` minimal 32 karakter dan jangan memakai
   secret default development.

## Keamanan Repository

Jangan commit file berikut:

```text
backend/.env
backend/*.sqlite
backend/node_modules/
frontend/node_modules/
```

Gunakan `.env.example` sebagai template konfigurasi.

## Dokumentasi Template Awal

Bagian berikut mempertahankan dokumentasi dari starter template project.

## Struktur Template

```
fullstack-template/
├── backend/     # Express API (app.js, config/, routes/, controllers/, utils/)
└── frontend/    # Vite + React + Tailwind
```

Tiap folder, termasuk subfolder di `frontend/src/`, memiliki README sendiri
yang menjelaskan isi dan fungsinya masing-masing.

## Pola Arsitektur Template

Backend mengikuti pola `routes/<nama>.routes.js` dan
`controllers/<nama>.controller.js`. Route baru didaftarkan di `app.js`, dan
controller mengembalikan response melalui `sendResponse()` dari
`utils/response.js` agar format response API tetap konsisten.

Frontend menggunakan pemisahan berikut:

- `pages/` untuk komponen level halaman.
- `components/` untuk UI reusable.
- `hooks/` untuk logic React dan state.
- `routes/` untuk definisi route.
- `utils/` untuk fungsi bantu dan API client.

Pola yang disarankan adalah halaman menyusun hooks dan components, sedangkan
logic fetch/data dipisahkan ke hooks atau utils.

## Pemisahan Backend dan Frontend

Backend dan frontend memiliki `package.json`, `node_modules`, dan siklus
deploy masing-masing. Pemisahan ini memungkinkan backend dan frontend
dijalankan serta di-deploy secara terpisah.

Backend dapat di-deploy ke layanan seperti Railway, sedangkan frontend dapat
di-deploy ke Vercel atau Netlify sesuai kebutuhan project.

## Cara Mengembangkan Template

1. Backend: tambahkan model, route, dan controller baru mengikuti pola
   `health.*` atau controller fitur yang sudah tersedia.
2. Frontend: tambahkan halaman baru di `pages/`, daftarkan di
   `routes/index.jsx`, pisahkan logic data ke `hooks/`, dan buat potongan UI
   reusable di `components/`.

<!-- Commit: style(ui): setup base styling and layout framework - 09/04/2026 05:34:29 -->

<!-- Commit: feat(ui): build login and registration page UI - 09/04/2026 05:34:31 -->

<!-- Commit: feat(ui): implement doctor dashboard and schedule list view - 09/04/2026 05:34:32 -->

<!-- Commit: feat(ui): create patient booking form and confirmation page - 09/04/2026 05:34:33 -->

<!-- Commit: fix(ui): adjust responsive design and fix broken layout on mobile - 09/04/2026 05:34:34 -->
