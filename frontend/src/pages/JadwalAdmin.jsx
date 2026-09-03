import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialSchedules = [
  {
    id: 1,
    dokter: 'dr. Andi Prasetyo',
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '14:00',
    kuota: 20,
    status: 'Aktif',
  },
  {
    id: 2,
    dokter: 'drg. Sinta Wulandari',
    hari: 'Rabu',
    jamMulai: '09:00',
    jamSelesai: '15:00',
    kuota: 15,
    status: 'Aktif',
  },
  {
    id: 3,
    dokter: 'dr. Budi Santoso, Sp.A',
    hari: 'Kamis',
    jamMulai: '10:00',
    jamSelesai: '16:00',
    kuota: 12,
    status: 'Aktif',
  },
];

const emptyForm = {
  dokter: '',
  hari: '',
  jamMulai: '',
  jamSelesai: '',
  kuota: '',
  status: 'Aktif',
};

function JadwalAdmin() {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState(() => {
    try {
      const savedSchedules = localStorage.getItem('schedules');

      if (savedSchedules) {
        return JSON.parse(savedSchedules);
      }
    } catch (error) {
      console.error('Gagal membaca data jadwal:', error);
    }

    localStorage.setItem(
      'schedules',
      JSON.stringify(initialSchedules)
    );

    return initialSchedules;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const saveSchedules = (data) => {
    setSchedules(data);

    localStorage.setItem(
      'schedules',
      JSON.stringify(data)
    );
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingId(schedule.id);

    setForm({
      dokter: schedule.dokter,
      hari: schedule.hari,
      jamMulai: schedule.jamMulai,
      jamSelesai: schedule.jamSelesai,
      kuota: schedule.kuota,
      status: schedule.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === editingId
          ? {
              ...schedule,
              ...form,
              kuota: Number(form.kuota),
            }
          : schedule
      );

      saveSchedules(updatedSchedules);
    } else {
      const newSchedule = {
        id: Date.now(),
        ...form,
        kuota: Number(form.kuota),
      };

      const updatedSchedules = [
        ...schedules,
        newSchedule,
      ];

      saveSchedules(updatedSchedules);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const updatedSchedules = schedules.filter(
      (schedule) => schedule.id !== deleteTarget.id
    );

    saveSchedules(updatedSchedules);

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Kelola Jadwal Dokter
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Daftar Jadwal
            </h2>

            <p className="text-gray-500 mt-1">
              Atur jadwal praktik, kuota, dan status dokter.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-lg transition"
          >
            + Tambah Jadwal
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-4">No</th>
                  <th className="px-5 py-4">Dokter</th>
                  <th className="px-5 py-4">Hari</th>
                  <th className="px-5 py-4">Jam Praktik</th>
                  <th className="px-5 py-4">Kuota</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {schedules.length > 0 ? (
                  schedules.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {schedule.dokter}
                      </td>

                      <td className="px-5 py-4">
                        {schedule.hari}
                      </td>

                      <td className="px-5 py-4">
                        {schedule.jamMulai} -{' '}
                        {schedule.jamSelesai}
                      </td>

                      <td className="px-5 py-4">
                        {schedule.kuota}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            schedule.status === 'Aktif'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {schedule.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(schedule)
                            }
                            className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(schedule)
                            }
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100"
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
                      colSpan="7"
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      Belum ada jadwal dokter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingId !== null
                    ? 'Edit Jadwal'
                    : 'Tambah Jadwal'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Isi data jadwal praktik dokter.
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
                  Dokter
                </label>

                <input
                  type="text"
                  name="dokter"
                  value={form.dokter}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: dr. Andi Prasetyo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari
                </label>

                <select
                  name="hari"
                  value={form.hari}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">
                    Pilih hari
                  </option>
                  <option value="Senin">
                    Senin
                  </option>
                  <option value="Selasa">
                    Selasa
                  </option>
                  <option value="Rabu">
                    Rabu
                  </option>
                  <option value="Kamis">
                    Kamis
                  </option>
                  <option value="Jumat">
                    Jumat
                  </option>
                  <option value="Sabtu">
                    Sabtu
                  </option>
                  <option value="Minggu">
                    Minggu
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Mulai
                  </label>

                  <input
                    type="time"
                    name="jamMulai"
                    value={form.jamMulai}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Selesai
                  </label>

                  <input
                    type="time"
                    name="jamSelesai"
                    value={form.jamSelesai}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kuota Pasien
                </label>

                <input
                  type="number"
                  min="1"
                  name="kuota"
                  value={form.kuota}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 20"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Aktif">
                    Aktif
                  </option>
                  <option value="Nonaktif">
                    Nonaktif
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold"
                >
                  {editingId !== null
                    ? 'Simpan Perubahan'
                    : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center">
            <div className="text-5xl mb-4">
              🗑️
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              Hapus Jadwal?
            </h3>

            <p className="text-gray-500 mt-3">
              Jadwal{' '}
              <span className="font-semibold text-gray-700">
                {deleteTarget.dokter}
              </span>{' '}
              pada hari {deleteTarget.hari} akan dihapus.
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold"
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

export default JadwalAdmin;