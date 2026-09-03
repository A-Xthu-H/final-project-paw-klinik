const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const database = new Database(path.join(__dirname, 'klinik.sqlite'));
database.pragma('foreign_keys = ON');

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'pasien'))
  );
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    spesialisasi TEXT NOT NULL,
    foto TEXT DEFAULT '',
    deskripsi TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    hari TEXT NOT NULL,
    jam_mulai TEXT NOT NULL,
    jam_selesai TEXT NOT NULL,
    kuota INTEGER NOT NULL CHECK (kuota > 0),
    status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif'))
  );
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori TEXT NOT NULL,
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pasien_id INTEGER REFERENCES users(id),
    nama_pasien TEXT NOT NULL,
    kontak_pasien TEXT NOT NULL,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    schedule_id INTEGER REFERENCES schedules(id),
    tanggal TEXT NOT NULL,
    jam TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Dikonfirmasi', 'Dibatalkan', 'Selesai')),
    sumber TEXT NOT NULL DEFAULT 'form',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    pesan TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'ai')),
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const seedUser = database.prepare('INSERT OR IGNORE INTO users (nama, email, password_hash, role) VALUES (?, ?, ?, ?)');
if (!database.prepare('SELECT 1 FROM users WHERE email = ?').get('admin@klinik.com')) {
  seedUser.run('Admin Klinik', 'admin@klinik.com', bcrypt.hashSync('admin123', 10), 'admin');
}
if (!database.prepare('SELECT 1 FROM users WHERE email = ?').get('pasien@klinik.com')) {
  seedUser.run('Budi Santoso', 'pasien@klinik.com', bcrypt.hashSync('pasien123', 10), 'pasien');
}

const seedDoctor = database.prepare('INSERT OR IGNORE INTO doctors (id, nama, spesialisasi, deskripsi) VALUES (?, ?, ?, ?)');
[
  [1, 'dr. Andi Prasetyo', 'Poli Umum', 'Dokter umum Klinik Sehat Sentosa.'],
  [2, 'drg. Sinta Wulandari', 'Poli Gigi', 'Dokter gigi Klinik Sehat Sentosa.'],
  [3, 'dr. Budi Santoso, Sp.A', 'Poli Anak', 'Dokter spesialis anak Klinik Sehat Sentosa.'],
].forEach((doctor) => seedDoctor.run(...doctor));

const seedSchedule = database.prepare('INSERT OR IGNORE INTO schedules (id, doctor_id, hari, jam_mulai, jam_selesai, kuota, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
[
  [1, 1, 'Senin', '08:00', '14:00', 20, 'Aktif'],
  [2, 2, 'Rabu', '09:00', '15:00', 15, 'Aktif'],
  [3, 3, 'Kamis', '10:00', '16:00', 12, 'Aktif'],
].forEach((schedule) => seedSchedule.run(...schedule));

const seedKnowledge = database.prepare('INSERT OR IGNORE INTO knowledge_base (id, kategori, judul, konten) VALUES (?, ?, ?, ?)');
[
  [1, 'Profil Klinik', 'Jam Operasional Klinik', 'Senin-Jumat 07:00-20:00, Sabtu 07:00-17:00, Minggu 08:00-14:00. IGD buka 24 jam.'],
  [2, 'Layanan', 'Poli Umum', 'Pemeriksaan kesehatan umum, keluhan ringan hingga sedang, surat rujukan, dan medical check up dasar.'],
  [3, 'Prosedur', 'Pendaftaran Pasien Baru', 'Pasien baru membawa KTP dan kartu BPJS/asuransi jika ada, kemudian mengisi data diri dan mengambil nomor antrean.'],
  [4, 'FAQ', 'Apakah klinik menerima BPJS?', 'Ya, Klinik Sehat Sentosa bekerja sama dengan BPJS Kesehatan.'],
].forEach((knowledge) => seedKnowledge.run(...knowledge));

module.exports = database;
