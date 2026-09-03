function buildDocuments(knowledgeFile, database) {
  const fileDocuments = [
    { kategori: 'Profil Klinik', judul: 'Profil dan fasilitas klinik', konten: `${knowledgeFile.profil_klinik.nama}, ${knowledgeFile.profil_klinik.alamat}. Fasilitas: ${knowledgeFile.profil_klinik.fasilitas.join(', ')}.` },
    { kategori: 'Profil Klinik', judul: 'Jam operasional klinik', konten: `Senin-Jumat ${knowledgeFile.profil_klinik.jam_operasional.senin_jumat}, Sabtu ${knowledgeFile.profil_klinik.jam_operasional.sabtu}, Minggu ${knowledgeFile.profil_klinik.jam_operasional.minggu}.` },
    ...knowledgeFile.layanan_poliklinik.map((item) => ({ kategori: 'Layanan', judul: item.nama, konten: `${item.deskripsi} Konsultasi sekitar ${item.harga_konsultasi}.` })),
    ...knowledgeFile.faq.map((item) => ({ kategori: 'FAQ', judul: item.pertanyaan, konten: item.jawaban })),
    { kategori: 'Prosedur', judul: 'Pendaftaran pasien', konten: `${knowledgeFile.prosedur_pendaftaran.pasien_baru.join(' ')} ${knowledgeFile.prosedur_pendaftaran.pendaftaran_online}` },
  ];
  const databaseDocuments = [
    ...database.prepare('SELECT kategori, judul, konten FROM knowledge_base').all(),
    ...database.prepare('SELECT nama, spesialisasi, deskripsi FROM doctors').all(),
    ...database.prepare("SELECT 'Jadwal Dokter' AS kategori, d.nama AS dokter, s.hari, s.jam_mulai AS jamMulai, s.jam_selesai AS jamSelesai, s.kuota FROM schedules s JOIN doctors d ON d.id = s.doctor_id WHERE s.status = 'Aktif'").all(),
  ];
  return [...fileDocuments, ...databaseDocuments];
}

function formatDocument(document) {
  if (document.dokter) return `${document.dokter} praktik hari ${document.hari}, pukul ${document.jamMulai}-${document.jamSelesai}, kuota ${document.kuota}.`;
  if (document.nama) return `${document.nama} (${document.spesialisasi}). ${document.deskripsi || ''}`;
  return `${document.judul}: ${document.konten}`;
}

module.exports = { buildDocuments, formatDocument };
