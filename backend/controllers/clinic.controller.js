const database = require('../db');
const sendResponse = require('../utils/response');

const doctorSelect = `SELECT d.id, d.nama, d.spesialisasi, d.foto, d.deskripsi, (SELECT group_concat(s.hari, ', ') FROM schedules s WHERE s.doctor_id = d.id) AS jadwal, (SELECT group_concat(s.jam_mulai || ' - ' || s.jam_selesai, ', ') FROM schedules s WHERE s.doctor_id = d.id) AS jam FROM doctors d`;
const scheduleSelect = `SELECT s.id, s.doctor_id, d.nama AS dokter, s.hari, s.jam_mulai AS jamMulai, s.jam_selesai AS jamSelesai, s.kuota, s.status FROM schedules s JOIN doctors d ON d.id = s.doctor_id`;
const appointmentSelect = `SELECT a.id, a.nama_pasien AS namaPasien, a.kontak_pasien AS kontak, a.doctor_id, a.schedule_id, d.nama AS dokter, a.tanggal, a.jam, a.status, a.sumber FROM appointments a JOIN doctors d ON d.id = a.doctor_id`;

function ok(res, data, message = 'Berhasil') { return sendResponse(res, { code: 200, success: true, message, data }); }
function fail(res, message, code = 400) { return sendResponse(res, { code, success: false, message }); }
function required(body, fields) { return fields.every((field) => body[field] !== undefined && String(body[field]).trim() !== ''); }
function scheduleConflicts(doctorId, hari, jamMulai, jamSelesai, ignoredId = null) {
  const query = `SELECT COUNT(*) AS count FROM schedules WHERE doctor_id = ? AND hari = ? AND status = 'Aktif' AND jam_mulai < ? AND jam_selesai > ? ${ignoredId ? 'AND id != ?' : ''}`;
  const values = ignoredId ? [doctorId, hari, jamSelesai, jamMulai, ignoredId] : [doctorId, hari, jamSelesai, jamMulai];
  return database.prepare(query).get(...values).count > 0;
}

function doctors(req, res) { return ok(res, database.prepare(`${doctorSelect} ORDER BY id DESC`).all()); }
function createDoctor(req, res) {
  const { nama, spesialisasi, foto = '', deskripsi = '' } = req.body || {};
  if (!required(req.body || {}, ['nama', 'spesialisasi'])) return fail(res, 'Nama dan spesialisasi wajib diisi');
  const result = database.prepare('INSERT INTO doctors (nama, spesialisasi, foto, deskripsi) VALUES (?, ?, ?, ?)').run(nama, spesialisasi, foto, deskripsi);
  return ok(res, database.prepare(`${doctorSelect} WHERE id = ?`).get(result.lastInsertRowid), 'Dokter berhasil ditambahkan');
}
function updateDoctor(req, res) {
  const { nama, spesialisasi, foto = '', deskripsi = '' } = req.body || {};
  if (!required(req.body || {}, ['nama', 'spesialisasi'])) return fail(res, 'Nama dan spesialisasi wajib diisi');
  const result = database.prepare('UPDATE doctors SET nama = ?, spesialisasi = ?, foto = ?, deskripsi = ? WHERE id = ?').run(nama, spesialisasi, foto, deskripsi, req.params.id);
  if (!result.changes) return fail(res, 'Dokter tidak ditemukan', 404);
  return ok(res, database.prepare(`${doctorSelect} WHERE id = ?`).get(req.params.id), 'Dokter berhasil diubah');
}
function deleteDoctor(req, res) { const result = database.prepare('DELETE FROM doctors WHERE id = ?').run(req.params.id); return result.changes ? ok(res, null, 'Dokter berhasil dihapus') : fail(res, 'Dokter tidak ditemukan', 404); }

function schedules(req, res) { return ok(res, database.prepare(`${scheduleSelect} ORDER BY s.id DESC`).all()); }
function createSchedule(req, res) {
  const { doctor_id, dokter, hari, jamMulai, jamSelesai, kuota, status = 'Aktif' } = req.body || {};
  const doctorId = doctor_id || database.prepare('SELECT id FROM doctors WHERE nama = ?').get(dokter)?.id;
  if (!doctorId || !required(req.body || {}, ['hari', 'jamMulai', 'jamSelesai', 'kuota']) || jamMulai >= jamSelesai || Number(kuota) < 1) return fail(res, 'Data jadwal tidak valid');
  if (status === 'Aktif' && scheduleConflicts(doctorId, hari, jamMulai, jamSelesai)) return fail(res, 'Jadwal dokter bentrok', 409);
  const result = database.prepare('INSERT INTO schedules (doctor_id, hari, jam_mulai, jam_selesai, kuota, status) VALUES (?, ?, ?, ?, ?, ?)').run(doctorId, hari, jamMulai, jamSelesai, Number(kuota), status);
  return ok(res, database.prepare(`${scheduleSelect} WHERE s.id = ?`).get(result.lastInsertRowid), 'Jadwal berhasil ditambahkan');
}
function updateSchedule(req, res) {
  const { doctor_id, dokter, hari, jamMulai, jamSelesai, kuota, status = 'Aktif' } = req.body || {};
  const doctorId = doctor_id || database.prepare('SELECT id FROM doctors WHERE nama = ?').get(dokter)?.id;
  if (!doctorId || !required(req.body || {}, ['hari', 'jamMulai', 'jamSelesai', 'kuota']) || jamMulai >= jamSelesai || Number(kuota) < 1) return fail(res, 'Data jadwal tidak valid');
  if (status === 'Aktif' && scheduleConflicts(doctorId, hari, jamMulai, jamSelesai, req.params.id)) return fail(res, 'Jadwal dokter bentrok', 409);
  const result = database.prepare('UPDATE schedules SET doctor_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, kuota = ?, status = ? WHERE id = ?').run(doctorId, hari, jamMulai, jamSelesai, Number(kuota), status, req.params.id);
  if (!result.changes) return fail(res, 'Jadwal tidak ditemukan', 404);
  return ok(res, database.prepare(`${scheduleSelect} WHERE s.id = ?`).get(req.params.id), 'Jadwal berhasil diubah');
}
function deleteSchedule(req, res) { const result = database.prepare('DELETE FROM schedules WHERE id = ?').run(req.params.id); return result.changes ? ok(res, null, 'Jadwal berhasil dihapus') : fail(res, 'Jadwal tidak ditemukan', 404); }

function knowledge(req, res) { return ok(res, database.prepare('SELECT id, kategori, judul, konten, updated_at FROM knowledge_base ORDER BY id DESC').all()); }
function createKnowledge(req, res) { const { kategori, judul, konten } = req.body || {}; if (!required(req.body || {}, ['kategori', 'judul', 'konten'])) return fail(res, 'Kategori, judul, dan konten wajib diisi'); const result = database.prepare('INSERT INTO knowledge_base (kategori, judul, konten) VALUES (?, ?, ?)').run(kategori, judul, konten); return ok(res, database.prepare('SELECT * FROM knowledge_base WHERE id = ?').get(result.lastInsertRowid), 'Informasi berhasil ditambahkan'); }
function updateKnowledge(req, res) { const { kategori, judul, konten } = req.body || {}; if (!required(req.body || {}, ['kategori', 'judul', 'konten'])) return fail(res, 'Kategori, judul, dan konten wajib diisi'); const result = database.prepare("UPDATE knowledge_base SET kategori = ?, judul = ?, konten = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(kategori, judul, konten, req.params.id); if (!result.changes) return fail(res, 'Informasi tidak ditemukan', 404); return ok(res, database.prepare('SELECT * FROM knowledge_base WHERE id = ?').get(req.params.id), 'Informasi berhasil diubah'); }
function deleteKnowledge(req, res) { const result = database.prepare('DELETE FROM knowledge_base WHERE id = ?').run(req.params.id); return result.changes ? ok(res, null, 'Informasi berhasil dihapus') : fail(res, 'Informasi tidak ditemukan', 404); }

function appointments(req, res) { return ok(res, database.prepare(`${appointmentSelect} ORDER BY a.id DESC`).all()); }
function myAppointments(req, res) { return ok(res, database.prepare(`${appointmentSelect} WHERE a.pasien_id = ? ORDER BY a.id DESC`).all(req.user.id)); }
function createAppointment(req, res) {
  const { namaPasien, kontak, doctor_id, schedule_id, tanggal, jam, sumber = 'form' } = req.body || {};
  const schedule = database.prepare('SELECT * FROM schedules WHERE id = ? AND doctor_id = ? AND status = \'Aktif\'').get(schedule_id, doctor_id);
  if (!schedule || !required(req.body || {}, ['namaPasien', 'kontak', 'tanggal', 'jam']) || jam < schedule.jam_mulai || jam >= schedule.jam_selesai) return fail(res, 'Jadwal appointment tidak valid');
  const booked = database.prepare("SELECT COUNT(*) AS count FROM appointments WHERE schedule_id = ? AND tanggal = ? AND status != 'Dibatalkan'").get(schedule_id, tanggal).count;
  if (booked >= schedule.kuota) return fail(res, 'Kuota jadwal sudah penuh', 409);
  const result = database.prepare('INSERT INTO appointments (pasien_id, nama_pasien, kontak_pasien, doctor_id, schedule_id, tanggal, jam, sumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(req.user.id, namaPasien, kontak, doctor_id, schedule_id, tanggal, jam, sumber);
  return ok(res, database.prepare(`${appointmentSelect} WHERE a.id = ?`).get(result.lastInsertRowid), 'Appointment berhasil dibuat');
}
function updateAppointmentStatus(req, res) { const allowed = ['Menunggu', 'Dikonfirmasi', 'Dibatalkan', 'Selesai']; if (!allowed.includes(req.body?.status)) return fail(res, 'Status appointment tidak valid'); const result = database.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(req.body.status, req.params.id); return result.changes ? ok(res, database.prepare(`${appointmentSelect} WHERE a.id = ?`).get(req.params.id), 'Status appointment diperbarui') : fail(res, 'Appointment tidak ditemukan', 404); }
function rescheduleAppointment(req, res) {
  const { doctor_id, schedule_id, tanggal, jam } = req.body || {};
  const schedule = database.prepare("SELECT * FROM schedules WHERE id = ? AND doctor_id = ? AND status = 'Aktif'").get(schedule_id, doctor_id);
  if (!schedule || !tanggal || !jam || jam < schedule.jam_mulai || jam >= schedule.jam_selesai) return fail(res, 'Jadwal baru tidak valid');
  const booked = database.prepare("SELECT COUNT(*) AS count FROM appointments WHERE schedule_id = ? AND tanggal = ? AND status != 'Dibatalkan' AND id != ?").get(schedule_id, tanggal, req.params.id).count;
  if (booked >= schedule.kuota) return fail(res, 'Kuota jadwal baru sudah penuh', 409);
  const result = database.prepare('UPDATE appointments SET doctor_id = ?, schedule_id = ?, tanggal = ?, jam = ? WHERE id = ?').run(doctor_id, schedule_id, tanggal, jam, req.params.id);
  return result.changes ? ok(res, database.prepare(`${appointmentSelect} WHERE a.id = ?`).get(req.params.id), 'Appointment dijadwalkan ulang') : fail(res, 'Appointment tidak ditemukan', 404);
}

function dashboard(req, res) { return ok(res, { doctors: database.prepare('SELECT COUNT(*) AS count FROM doctors').get().count, activeSchedules: database.prepare("SELECT COUNT(*) AS count FROM schedules WHERE status = 'Aktif'").get().count, appointments: database.prepare('SELECT COUNT(*) AS count FROM appointments').get().count }); }

module.exports = { doctors, createDoctor, updateDoctor, deleteDoctor, schedules, createSchedule, updateSchedule, deleteSchedule, knowledge, createKnowledge, updateKnowledge, deleteKnowledge, appointments, myAppointments, createAppointment, updateAppointmentStatus, rescheduleAppointment, dashboard };
