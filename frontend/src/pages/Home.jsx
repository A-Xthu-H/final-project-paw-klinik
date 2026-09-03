import { Link } from 'react-router-dom';
import HealthBadge from '../components/HealthBadge';
import ChatbotWidget from '../components/ChatbotWidget';
import { useHealthCheck } from '../hooks/useHealthCheck';

const services = [
  ['🩺', 'Poli Umum', 'Pemeriksaan kesehatan umum dan keluhan ringan hingga sedang.'],
  ['🦷', 'Poli Gigi', 'Perawatan gigi, scaling, tambal gigi, dan konsultasi mulut.'],
  ['🧸', 'Poli Anak', 'Tumbuh kembang, imunisasi, dan penanganan penyakit anak.'],
  ['🤰', 'Poli Kandungan', 'Pemeriksaan kehamilan, USG, KB, dan kesehatan reproduksi.'],
  ['💊', 'Penyakit Dalam', 'Penanganan diabetes, hipertensi, dan gangguan pencernaan.'],
  ['🧴', 'Poli Kulit', 'Konsultasi masalah kulit, alergi, dan perawatan dasar.'],
];

const doctors = [
  ['dr. Andi Prasetyo', 'Poli Umum', 'Senin, Selasa, Rabu, Jumat', '08:00 - 14:00'],
  ['drg. Sinta Wulandari', 'Poli Gigi', 'Senin, Rabu, Kamis, Sabtu', '09:00 - 15:00'],
  ['dr. Budi Santoso, Sp.A', 'Poli Anak', 'Selasa, Kamis, Sabtu', '10:00 - 16:00'],
  ['dr. Ratna Dewi, Sp.OG', 'Poli Kandungan', 'Senin, Rabu, Jumat', '13:00 - 18:00'],
  ['dr. Hendra Wijaya, Sp.PD', 'Penyakit Dalam', 'Selasa, Kamis', '14:00 - 19:00'],
  ['dr. Maya Kusuma, Sp.KK', 'Poli Kulit', 'Jumat, Sabtu', '10:00 - 15:00'],
];

const procedures = [
  ['01', 'Daftar', 'Datang ke loket atau daftar melalui WhatsApp/website.'],
  ['02', 'Siapkan dokumen', 'Bawa KTP dan kartu BPJS/asuransi jika ada.'],
  ['03', 'Isi data', 'Isi data diri dan pilih poli tujuan.'],
  ['04', 'Ambil antrean', 'Dapatkan nomor antrean dari petugas.'],
  ['05', 'Tunggu panggilan', 'Tunggu pemeriksaan sesuai urutan antrean.'],
];

function Home() {
  const { status, data, checkHealth } = useHealthCheck();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2 font-bold text-teal-700"><span className="text-2xl">🏥</span> Klinik Sehat Sentosa</a>
          <div className="hidden gap-6 text-sm font-medium text-gray-600 md:flex"><a href="#profil">Profil</a><a href="#layanan">Layanan</a><a href="#dokter">Dokter</a><a href="#prosedur">Prosedur</a></div>
          <div className="flex gap-2"><Link to="/login/pasien" className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Login Pasien</Link><Link to="/login/admin" className="hidden rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 sm:block">Login Admin</Link></div>
        </div>
      </nav>

      <main id="top">
        <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div><p className="mb-4 font-semibold uppercase tracking-widest text-teal-100">Layanan kesehatan terpercaya</p><h1 className="text-4xl font-bold leading-tight sm:text-6xl">Kesehatan Anda, Prioritas Kami</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-teal-50">Klinik Sehat Sentosa melayani konsultasi kesehatan umum hingga spesialis, dengan asisten virtual AI yang siap membantu 24 jam.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#layanan" className="rounded-lg bg-white px-5 py-3 font-semibold text-teal-700">Lihat layanan</a><a href="#chat" className="rounded-lg border border-white/70 px-5 py-3 font-semibold text-white">Tanya asisten AI</a></div></div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur"><p className="text-sm text-teal-100">Klinik Sehat Sentosa</p><p className="mt-3 text-3xl font-bold">Buka setiap hari</p><p className="mt-2 text-teal-50">Senin-Jumat 07:00-20:00<br />Sabtu 07:00-17:00<br />Minggu 08:00-14:00</p><div className="mt-6 border-t border-white/20 pt-5"><p className="font-semibold">IGD 24 jam</p><p className="text-sm text-teal-100">Bantuan darurat tersedia setiap hari.</p></div></div>
          </div>
        </section>

        <section id="profil" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-10 md:grid-cols-2 md:items-center"><div><p className="font-semibold text-teal-700">Tentang klinik</p><h2 className="mt-2 text-3xl font-bold">Pelayanan cepat, ramah, dan terpercaya</h2><p className="mt-5 leading-relaxed text-gray-600">Kami hadir untuk memberikan layanan kesehatan yang mudah diakses bagi masyarakat Yogyakarta dan sekitarnya, didukung tenaga medis profesional dan fasilitas yang nyaman.</p><div className="mt-6 space-y-2 text-sm text-gray-600"><p>📍 Jl. Kesehatan Raya No. 45, Yogyakarta</p><p>☎️ (0274) 123456 · WhatsApp 0812-3456-7890</p><p>✉️ info@kliniksehatsentosa.co.id</p></div></div><div className="grid grid-cols-2 gap-4 rounded-2xl bg-teal-50 p-6">{['Ruang tunggu ber-AC', 'Apotek internal', 'Laboratorium klinik', 'Parkir luas', 'IGD 24 jam', 'BPJS tersedia'].map((item) => <div key={item} className="rounded-xl bg-white p-4 text-center text-sm font-semibold text-gray-700 shadow-sm">{item}</div>)}</div></div></section>

        <section id="layanan" className="bg-gray-50 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="text-center text-3xl font-bold">Layanan & Poliklinik</h2><p className="mx-auto mt-3 max-w-2xl text-center text-gray-500">Pilih layanan yang sesuai dengan kebutuhan kesehatan Anda.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(([icon, title, description]) => <article key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="text-4xl">{icon}</div><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p></article>)}</div></div></section>

        <section id="dokter" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-center text-3xl font-bold">Jadwal Dokter</h2><p className="mt-3 text-center text-gray-500">Jadwal praktik mingguan dokter kami.</p><div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-teal-700 text-white"><tr><th className="px-5 py-4">Dokter</th><th className="px-5 py-4">Spesialisasi</th><th className="px-5 py-4">Hari praktik</th><th className="px-5 py-4">Jam</th></tr></thead><tbody>{doctors.map(([name, specialty, days, hours], index) => <tr key={name} className={index % 2 ? 'bg-gray-50' : 'bg-white'}><td className="px-5 py-4 font-semibold">{name}</td><td className="px-5 py-4 text-gray-600">{specialty}</td><td className="px-5 py-4 text-gray-600">{days}</td><td className="px-5 py-4 text-gray-600">{hours}</td></tr>)}</tbody></table></div></section>

        <section id="prosedur" className="bg-gray-50 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="text-center text-3xl font-bold">Prosedur Pendaftaran</h2><p className="mt-3 text-center text-gray-500">Lima langkah sederhana untuk mendapatkan pelayanan.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{procedures.map(([number, title, description]) => <article key={number} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-2xl font-bold text-teal-700">{number}</p><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p></article>)}</div></div></section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-teal-50 p-5"><div><p className="font-bold text-teal-900">Status koneksi aplikasi</p><HealthBadge status={status} /></div><button type="button" onClick={checkHealth} className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700">Cek backend</button>{data && <span className="text-xs text-gray-500">Server terakhir diperiksa</span>}</div></section>
      </main>
      <footer className="bg-gray-900 py-10 text-gray-300"><div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm sm:grid-cols-3 sm:px-6 lg:px-8"><div><p className="font-bold text-white">Klinik Sehat Sentosa</p><p className="mt-3 text-gray-400">Melayani kesehatan Anda dan keluarga dengan sepenuh hati.</p></div><div><p className="font-semibold text-white">Kontak</p><p className="mt-3 text-gray-400">Jl. Kesehatan Raya No. 45, Yogyakarta<br />0812-3456-7890</p></div><div><p className="font-semibold text-white">Jam operasional</p><p className="mt-3 text-gray-400">Senin-Jumat 07:00-20:00<br />Sabtu 07:00-17:00<br />Minggu 08:00-14:00</p></div></div></footer>
      <div id="chat"><ChatbotWidget /></div>
    </div>
  );
}

export default Home;
