import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiDelete, apiGet, apiPost, apiPut } from '../utils/api';

const initialDoctors = [
  {
    id: 1,
    nama: 'dr. Andi Prasetyo',
    spesialisasi: 'Poli Umum',
    jadwal: 'Senin, Selasa, Rabu, Jumat',
    jam: '08:00 - 14:00',
  },
  {
    id: 2,
    nama: 'drg. Sinta Wulandari',
    spesialisasi: 'Poli Gigi',
    jadwal: 'Senin, Rabu, Kamis, Sabtu',
    jam: '09:00 - 15:00',
  },
  {
    id: 3,
    nama: 'dr. Budi Santoso, Sp.A',
    spesialisasi: 'Poli Anak',
    jadwal: 'Selasa, Kamis, Sabtu',
    jam: '10:00 - 16:00',
  },
  {
    id: 4,
    nama: 'dr. Ratna Dewi, Sp.OG',
    spesialisasi: 'Poli Kandungan',
    jadwal: 'Senin, Rabu, Jumat',
    jam: '13:00 - 18:00',
  },
  {
    id: 5,
    nama: 'dr. Hendra Wijaya, Sp.PD',
    spesialisasi: 'Poli Penyakit Dalam',
    jadwal: 'Selasa, Kamis',
    jam: '14:00 - 19:00',
  },
  {
    id: 6,
    nama: 'dr. Maya Kusuma, Sp.KK',
    spesialisasi: 'Poli Kulit & Kelamin',
    jadwal: 'Jumat, Sabtu',
    jam: '10:00 - 15:00',
  },
];

const emptyForm = {
  nama: '',
  spesialisasi: '',
  foto: '',
  deskripsi: '',
  jadwal: '',
  jam: '',
};

function DokterAdmin() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState(initialDoctors);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [operationError, setOperationError] = useState('');

  useEffect(() => { apiGet('/api/doctors').then((result) => setDoctors(result.data || [])).catch(() => setLoadError('Data dokter tidak dapat dimuat. Pastikan backend aktif.')); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingId(doctor.id);

    setForm({
      nama: doctor.nama,
      spesialisasi: doctor.spesialisasi,
      foto: doctor.foto || '',
      deskripsi: doctor.deskripsi || '',
      jadwal: doctor.jadwal,
      jam: doctor.jam,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationError('');

    try {
      if (editingId !== null) {
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === editingId
          ? {
              ...doctor,
              ...form,
            }
          : doctor
      );

      const result = await apiPut(`/api/doctors/${editingId}`, form);
      setDoctors((current) => current.map((doctor) => doctor.id === editingId ? result.data : doctor));
      } else {
      const newDoctor = {
        id: Date.now(),
        ...form,
      };

      const updatedDoctors = [
        ...doctors,
        newDoctor,
      ];

      const result = await apiPost('/api/doctors', form);
      setDoctors((current) => [...current, result.data]);
      }
    } catch (error) {
      setOperationError(error.message || 'Data dokter gagal disimpan.');
      return;
    }

    closeModal();
  };

  const confirmDelete = (doctor) => {
    setDeleteTarget(doctor);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const updatedDoctors = doctors.filter(
      (doctor) => doctor.id !== deleteTarget.id
    );

    try {
      await apiDelete(`/api/doctors/${deleteTarget.id}`);
    } catch (error) {
      setOperationError(error.message || 'Dokter gagal dihapus.');
      return;
    }
    setDoctors((current) => current.filter((doctor) => doctor.id !== deleteTarget.id));

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Kelola Dokter
            </h1>

            <p className="text-sm text-gray-500">
              Klinik Sehat Sentosa
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>}
        {operationError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{operationError}</div>}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Dokter
            </h2>

            <p className="text-gray-500 mt-1">
              Kelola data dokter yang tersedia di klinik.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-lg transition"
          >
            + Tambah Dokter
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-700">
                    No
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-700">
                    Nama Dokter
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-700">
                    Spesialisasi
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-700">
                    Hari Praktik
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-700">
                    Jam
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-700 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <tr
                      key={doctor.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {doctor.nama}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {doctor.spesialisasi}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {doctor.jadwal}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {doctor.jam}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(doctor)
                            }
                            className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              confirmDelete(doctor)
                            }
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      Belum ada data dokter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId !== null
                    ? 'Edit Dokter'
                    : 'Tambah Dokter'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {editingId !== null
                    ? 'Ubah data dokter yang dipilih.'
                    : 'Masukkan data dokter baru.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Dokter
                </label>

                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: dr. Ahmad"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spesialisasi
                </label>

                <input
                  type="text"
                  name="spesialisasi"
                  value={form.spesialisasi}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Poli Umum"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari Praktik
                </label>

                <input
                  type="text"
                  name="jadwal"
                  value={form.jadwal}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Senin, Rabu, Jumat"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Foto (opsional)
                </label>
                <input type="url" name="foto" value={form.foto} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Singkat
                </label>
                <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} required rows="3" placeholder="Deskripsi dokter" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Praktik
                </label>

                <input
                  type="text"
                  name="jam"
                  value={form.jam}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 08:00 - 14:00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                >
                  {editingId !== null
                    ? 'Simpan Perubahan'
                    : 'Simpan Dokter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">
                🗑️
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                Hapus Dokter?
              </h3>

              <p className="text-gray-500 mt-3">
                Apakah Anda yakin ingin menghapus{' '}
                <span className="font-semibold text-gray-700">
                  {deleteTarget.nama}
                </span>
                ?
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Data yang dihapus tidak dapat dikembalikan.
              </p>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DokterAdmin;