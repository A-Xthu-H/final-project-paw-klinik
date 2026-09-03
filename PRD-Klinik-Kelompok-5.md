# Product Requirements Document (PRD)
## Aplikasi Web Klinik dengan Chatbot RAG

| | |
|---|---|
| **Nama Produk** | Aplikasi Web Klinik |
| **Jenis Dokumen** | PRD (Product Requirements Document) |
| **Mata Kuliah** | PAW (Pengembangan Aplikasi Web) — Final Project |
| **Kelompok** | Kelompok 5 |
| **Repositori** | github.com/A-Xthu-H/final-project-kel5 |
| **Drive** | [Link Drive](https://drive.google.com/drive/folders/1zuP4EaB6fLQCLcg8ChGYcPbLfsKTOpul?usp=sharing) |
| **Versi Dokumen** | 1.1 |
| **Status** | Disesuaikan dengan implementasi project |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang
Pasien klinik sering kesulitan mendapat informasi cepat seputar jadwal dokter, layanan yang tersedia, prosedur pendaftaran, dan jam operasional — apalagi di luar jam kerja staf admin. Aplikasi ini dibangun untuk menjawab kebutuhan itu lewat chatbot 24/7 berbasis **Retrieval-Augmented Generation (RAG)**, yang menjawab berdasarkan basis pengetahuan klinik sehingga informasi selalu bisa diperbarui admin tanpa perlu melatih ulang model.

### 1.2 Tujuan Produk
- Memberi akses informasi klinik yang cepat dan akurat kapan saja lewat chatbot RAG.
- Memudahkan admin mengelola data dokter dan jadwal praktik secara terpusat.
- Memungkinkan pasien membuat janji temu (appointment) melalui alur booking pada percakapan chatbot maupun form appointment pasien.
- Menjadi capstone project PAW yang mendemonstrasikan integrasi RAG ke dalam sistem informasi layanan nyata.

### 1.3 Target Pengguna
| Peran | Deskripsi |
|---|---|
| **Pasien/Pengunjung** | Mengakses informasi klinik via landing page dan chatbot, melihat jadwal dokter, serta booking appointment |
| **Admin** | Login, mengelola data dokter & jadwal, mengelola basis pengetahuan chatbot, memantau/mengelola appointment |

---

## 2. Ruang Lingkup (Scope)

### 2.1 In-Scope
- Login & dashboard admin
- **Manajemen data dokter** (profil, spesialisasi, dsb.) oleh admin
- **Manajemen jadwal praktik dokter** (hari, jam, kuota) oleh admin
- Halaman informasi klinik (layanan, jam operasional, prosedur pendaftaran) yang dapat dikelola admin sebagai basis pengetahuan
- **Chatbot 24/7 berbasis RAG** yang menjawab pertanyaan pasien menggunakan basis pengetahuan klinik (jadwal dokter, layanan, prosedur, dsb.)
- **Appointment melalui chatbot** — pasien dapat membuka alur booking dari percakapan dan data appointment disimpan dengan sumber `chat`
- Appointment manual pasien dan halaman riwayat appointment
- ChatHistory berdasarkan session percakapan
- Manajemen data appointment oleh admin (lihat, konfirmasi, batalkan)

### 2.2 Out-of-Scope (untuk versi final project ini)
- Payment gateway / pembayaran biaya konsultasi online
- Rekam medis elektronik (electronic medical record) lengkap
- Aplikasi mobile native
- Video call konsultasi dengan dokter
- Notifikasi via WhatsApp/SMS (cukup notifikasi/status dalam sistem)

---

## 3. Tech Stack

*(Disesuaikan dengan implementasi project saat ini)*

| Layer | Teknologi |
|---|---|
| Backend | Express.js (Node.js) |
| Database | SQLite melalui `better-sqlite3` — menyimpan user, dokter, jadwal, knowledge, appointment, dan ChatHistory |
| Frontend/View | React + Vite + Tailwind CSS |
| AI Engine | Gemini API untuk semantic embedding dan komponen *generation* pada RAG |
| Vector Store / Retrieval | Embedding Gemini dengan cosine similarity dan cache in-memory; TF-IDF lokal digunakan sebagai fallback jika embedding gagal |

> **Catatan implementasi:** RAG pada project ini terdiri dari (1) *retrieval* menggunakan embedding Gemini dan cosine similarity terhadap dokumen knowledge, dokter, serta jadwal terbaru, dan (2) *generation* menggunakan Gemini berdasarkan dokumen hasil retrieval. Jika layanan embedding atau LLM gagal, sistem menggunakan fallback TF-IDF atau jawaban berbasis dokumen.

---

## 4. Struktur Tim & Pembagian Kerja

| Anggota | NIM | Kemungkinan Fokus *(draft awal, silakan disesuaikan tim)* |
|---|---|---|
| Hasan Muhammad Ridlo | 20200140054 | Backend, database, autentikasi |
| Pebri Bayu Satriansyah | 20240140058 | Admin dashboard, dokter, jadwal, appointment |
| Haris Shihab Dzul Firdausi | 20220140015 | Landing page, chatbot, knowledge base, testing |

> Catatan: pembagian di atas hanya draft berdasarkan urutan fitur — silakan tim diskusikan ulang siapa pegang bagian mana, terutama karena hanya 3 anggota untuk cukup banyak scope.

---

## 5. User Stories

| ID | Sebagai | Saya ingin | Agar |
|---|---|---|---|
| US-01 | Admin | Login ke dashboard | Bisa mengelola data klinik |
| US-02 | Admin | Menambah/mengubah/menghapus data dokter | Data dokter selalu akurat dan up-to-date |
| US-03 | Admin | Mengatur jadwal praktik tiap dokter | Pasien mendapat info jadwal yang benar |
| US-04 | Pasien | Bertanya ke chatbot kapan saja (24/7) | Mendapat info klinik tanpa harus menunggu jam kerja admin |
| US-05 | Pasien | Bertanya jadwal dokter tertentu ke chatbot | Tahu kapan bisa berobat ke dokter yang dituju |
| US-06 | Pasien | Bertanya prosedur pendaftaran/layanan klinik | Paham alur sebelum datang ke klinik |
| US-07 | Pasien | Membuat janji temu melalui alur booking di chat | Tidak perlu berpindah dari chatbot untuk memulai booking |
| US-08 | Admin | Melihat & mengelola basis pengetahuan chatbot | Jawaban chatbot tetap relevan saat ada info baru |
| US-09 | Admin | Melihat & mengelola daftar appointment | Bisa mengonfirmasi atau menjadwalkan ulang janji temu pasien |

---

## 6. Kebutuhan Fungsional (Functional Requirements)

### 6.1 Autentikasi & Dashboard Admin
- FR-1.1: Sistem menyediakan form login untuk admin
- FR-1.2: Dashboard admin menampilkan ringkasan (jumlah dokter, jadwal aktif, appointment terbaru)
- FR-1.3: Halaman manajemen dibatasi hanya untuk admin yang login

### 6.2 Manajemen Dokter (Fitur Baru — sesuai permintaan)
- FR-2.1: Admin dapat menambah, mengubah, menghapus, dan melihat daftar dokter
- FR-2.2: Setiap dokter memiliki nama, spesialisasi, foto (opsional), dan deskripsi singkat
- FR-2.3: Data dokter yang diubah admin harus tersinkron ke basis pengetahuan chatbot (lihat FR-4.4)

### 6.3 Manajemen Jadwal Dokter (Fitur Baru — sesuai permintaan)
- FR-3.1: Admin dapat mengatur jadwal praktik per dokter (hari, jam mulai–selesai)
- FR-3.2: Admin dapat mengatur kuota pasien per sesi jadwal (untuk mendukung fitur appointment)
- FR-3.3: Admin dapat menonaktifkan sementara jadwal tertentu (misal dokter cuti)
- FR-3.4: Data jadwal yang diubah harus tersinkron ke basis pengetahuan chatbot (lihat FR-4.4)

### 6.4 Chatbot 24/7 Berbasis RAG
- FR-4.1: Chatbot dapat diakses kapan saja tanpa perlu login (untuk pengunjung umum)
- FR-4.2: Pasien dapat bertanya bebas seputar jadwal dokter, layanan, prosedur pendaftaran, jam operasional, dsb.
- FR-4.3: Sistem melakukan retrieval semantic menggunakan embedding Gemini dan cosine similarity dari basis pengetahuan klinik, termasuk data dokter & jadwal terbaru, sebelum meminta Gemini menyusun jawaban
- FR-4.4: Perubahan data dokter/jadwal oleh admin (FR-2, FR-3) harus tercermin di basis pengetahuan yang dipakai chatbot — baik lewat re-index otomatis maupun query langsung ke tabel dokter/jadwal saat retrieval
- FR-4.5: Chatbot menampilkan jawaban dalam format percakapan (chat bubble), loading indicator, riwayat berdasarkan session, dan fallback jika informasi tidak ditemukan atau layanan AI gagal

### 6.5 Appointment Langsung dari Chat
- FR-5.1: Pasien dapat memulai proses booking appointment dari percakapan dengan memilih template appointment pada chatbot
- FR-5.2: Sistem menyediakan form percakapan untuk melengkapi dokter/jadwal, tanggal, jam, dan kontak pasien
- FR-5.3: Sistem mengecek ketersediaan slot jadwal dokter yang dituju (berdasarkan data di FR-3) sebelum mengonfirmasi
- FR-5.4: Jika slot tersedia, sistem membuat data appointment baru dan chatbot mengonfirmasi ke pasien dalam bahasa natural
- FR-5.5: Jika slot penuh/tidak tersedia, chatbot menginformasikan dan menawarkan alternatif jadwal terdekat
- FR-5.6: Appointment yang dibuat lewat chat muncul di dashboard admin sama seperti appointment biasa (jika ada form appointment terpisah di luar chat)

> **Catatan implementasi:** booking melalui chatbot menggunakan form terstruktur yang dibuka dari template appointment. Backend memvalidasi token pasien, dokter, jadwal aktif, hari/tanggal, jam praktik, kuota, dan bentrok appointment sebelum menyimpan sumber appointment sebagai `chat`.

### 6.6 Manajemen Appointment (Admin)
- FR-6.1: Admin dapat melihat daftar appointment (baik dari chat maupun form manual, jika keduanya ada)
- FR-6.2: Admin dapat mengonfirmasi, menjadwalkan ulang, atau membatalkan appointment
- FR-6.3: Setiap appointment memiliki status (menunggu konfirmasi/dikonfirmasi/dibatalkan/selesai)

---

## 7. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Ketersediaan** | Chatbot harus dapat diakses 24/7 tanpa bergantung pada jam kerja admin |
| **Akurasi Informasi** | Jawaban chatbot harus bersumber dari dokumen hasil retrieval semantic dan data database klinik; Gemini diarahkan menjawab hanya berdasarkan konteks tersebut |
| **Performance** | Respons chatbot idealnya di bawah ~5 detik, tampilkan loading indicator saat menunggu |
| **Security** | Password admin di-hash (bcrypt), endpoint manajemen dokter/jadwal/appointment hanya bisa diakses admin yang login; API key LLM disimpan di server |
| **Reliability** | Jika komponen RAG/LLM gagal, chatbot tetap menampilkan pesan fallback yang jelas, bukan error mentah |
| **Maintainability** | Basis pengetahuan chatbot harus mudah diperbarui admin tanpa retraining; data dokter dan jadwal dibaca langsung dari database saat retrieval |
| **Compatibility** | Widget chatbot responsif dan dapat diakses dari HP maupun desktop |

---

## 8. Skema Data (Ringkasan Entitas)

- **Users (Admin/Pasien)**: id, nama, email, password_hash (bcrypt), role
- **Doctors**: id, nama, spesialisasi, deskripsi, foto
- **Schedules**: id, doctor_id, hari, jam_mulai, jam_selesai, kuota, status (aktif/nonaktif)
- **KnowledgeBase**: id, judul, konten (FAQ/prosedur/info layanan), kategori, updated_at — sumber retrieval chatbot di luar data dokter/jadwal
- **Appointments**: id, pasien_id, nama_pasien, kontak_pasien, doctor_id, schedule_id, tanggal, jam, status (menunggu/dikonfirmasi/dibatalkan/selesai), sumber (chat/form), created_at
- **ChatHistory**: id, session_id, pesan, role (user/ai), timestamp

---

## 9. Alur Utama (User Flow)

### 9.1 Alur Pasien — Tanya Info via Chatbot
1. Pengunjung membuka website klinik → landing page menampilkan informasi klinik dan widget chatbot tanpa perlu login
2. Pasien bertanya, misal "Dokter gigi praktik hari apa saja?"
3. Sistem membuat embedding pertanyaan dan melakukan retrieval semantic dari knowledge, dokter, serta jadwal terbaru
4. Gemini menyusun jawaban berdasarkan hasil retrieval → ditampilkan dalam chat bubble; TF-IDF digunakan bila embedding gagal

### 9.2 Alur Pasien — Appointment via Chat
1. Pasien memilih template "Saya ingin membuat appointment" pada chatbot
2. Form booking pada percakapan meminta jadwal dokter, tanggal, jam, dan kontak pasien
3. Sistem cek ketersediaan slot jadwal dr. Ani hari Rabu jam 10
4. Jika tersedia → appointment dibuat, chatbot konfirmasi ke pasien
5. Jika tidak tersedia → chatbot menawarkan slot alternatif terdekat

### 9.3 Alur Admin
1. Admin login → dashboard
2. Kelola data dokter (tambah/ubah/hapus)
3. Kelola jadwal praktik tiap dokter
4. Kelola basis pengetahuan chatbot (info layanan, FAQ, prosedur)
5. Pantau & kelola daftar appointment (baik dari chat maupun manual)

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Chatbot memberi jawaban salah soal jadwal dokter (halusinasi LLM) | Pasien datang di waktu yang salah, kepercayaan menurun | Wajib gunakan pendekatan RAG (jawab hanya berdasarkan hasil retrieval), tambahkan fallback message jika info tidak ditemukan |
| Appointment via chat menggunakan form terstruktur | Validasi booking harus tetap konsisten dengan form manual | Backend memvalidasi token pasien, jadwal aktif, tanggal, jam, kuota, dan bentrok appointment |
| Slot appointment bentrok (dua pasien pilih slot sama bersamaan) | Data appointment tidak valid | Validasi kuota slot di server-side sebelum menyimpan appointment, baik dari chat maupun form |
| Layanan Gemini atau embedding gagal/terkena batas kuota | Chatbot tidak dapat memakai generation atau retrieval semantic | Gunakan fallback TF-IDF dan jawaban berbasis dokumen; API key hanya disimpan di backend |

---

## 11. Kriteria Keberhasilan (Definition of Done)

- Admin dan pasien dapat login dengan role yang sesuai; admin dapat mengelola data dokter serta jadwal praktik end-to-end
- Chatbot dapat diakses 24/7 dan menjawab pertanyaan berdasarkan embedding retrieval dan basis pengetahuan klinik, termasuk info jadwal dokter terbaru
- Basis pengetahuan chatbot dapat diperbarui admin tanpa perlu retraining model
- Pasien dapat membuat appointment melalui form maupun percakapan chatbot dan data tersimpan dengan benar di sistem admin
- Sistem menolak appointment jika tanggal tidak sesuai hari praktik, jam di luar jadwal, kuota penuh, atau jadwal bentrok
- Riwayat percakapan tersimpan berdasarkan session dan dapat dimuat kembali
- UI responsif di desktop maupun HP
- Repository dapat dijalankan ulang tanpa error oleh dosen penguji menggunakan file `.env.example`, database SQLite dibuat otomatis, dan automated test backend lulus

---

*Dokumen ini adalah PRD untuk Aplikasi Web Klinik, Kelompok 5. Isi dokumen telah disesuaikan dengan implementasi project saat ini. Appointment via chatbot menggunakan form terstruktur pada widget percakapan, sedangkan generation dan embedding Gemini memerlukan `GEMINI_API_KEY` pada environment backend.*
