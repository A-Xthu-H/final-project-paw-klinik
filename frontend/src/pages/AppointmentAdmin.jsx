import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialAppointments = [
  {
    id: 1,
    namaPasien: 'Budi Santoso',
    kontak: '081234567890',
    dokter: 'dr. Andi Prasetyo',
    tanggal: '2026-09-05',
    jam: '09:00',
    status: 'Menunggu',
  },
  {
    id: 2,
    namaPasien: 'Siti Aminah',
    kontak: '081298765432',
    dokter: 'drg. Sinta Wulandari',
    tanggal: '2026-09-06',
    jam: '10:30',
    status: 'Dikonfirmasi',
  },
];

function AppointmentAdmin() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(() => {
    try {
      const savedAppointments =
        localStorage.getItem('appointments');

      if (savedAppointments) {
        return JSON.parse(savedAppointments);
      }
    } catch (error) {
      console.error(
        'Gagal membaca data appointment:',
        error
      );
    }

    localStorage.setItem(
      'appointments',
      JSON.stringify(initialAppointments)
    );

    return initialAppointments;
  });

  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const saveAppointments = (data) => {
    setAppointments(data);

    localStorage.setItem(
      'appointments',
      JSON.stringify(data)
    );
  };

  const updateStatus = (id, status) => {
    const updatedAppointments = appointments.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
    );

    saveAppointments(updatedAppointments);
  };

  const openEditModal = (appointment) => {
    setEditingAppointment({
      ...appointment,
    });

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingAppointment(null);
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveReschedule = (e) => {
    e.preventDefault();

    if (!editingAppointment) return;

    const updatedAppointments = appointments.map(
      (item) =>
        item.id === editingAppointment.id
          ? {
              ...item,
              dokter: editingAppointment.dokter,
              tanggal: editingAppointment.tanggal,
              jam: editingAppointment.jam,
            }
          : item
    );

    saveAppointments(updatedAppointments);

    closeEditModal();
  };

  const statusClasses = {
    Menunggu: 'bg-yellow-100 text-yellow-700',
    Dikonfirmasi: 'bg-green-100 text-green-700',
    Dibatalkan: 'bg-red-100 text-red-700',
    Selesai: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Kelola Appointment
            </h1>

            <p className="text-sm text-gray-500">
              Klinik Sehat Sentosa
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/admin/dashboard')
            }
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Daftar Appointment
          </h2>

          <p className="text-gray-500 mt-1">
            Kelola jadwal appointment pasien.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-4">
                    No
                  </th>

                  <th className="px-5 py-4">
                    Pasien
                  </th>

                  <th className="px-5 py-4">
                    Kontak
                  </th>

                  <th className="px-5 py-4">
                    Dokter
                  </th>

                  <th className="px-5 py-4">
                    Tanggal
                  </th>

                  <th className="px-5 py-4">
                    Jam
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.length > 0 ? (
                  appointments.map(
                    (appointment, index) => (
                      <tr
                        key={appointment.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-800">
                          {appointment.namaPasien}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {appointment.kontak}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {appointment.dokter}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {appointment.tanggal}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {appointment.jam}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              statusClasses[
                                appointment.status
                              ] ||
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-center gap-2">
                            {appointment.status ===
                              'Menunggu' && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    'Dikonfirmasi'
                                  )
                                }
                                className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition"
                              >
                                Konfirmasi
                              </button>
                            )}

                            {appointment.status !==
                              'Selesai' &&
                              appointment.status !==
                                'Dibatalkan' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditModal(
                                      appointment
                                    )
                                  }
                                  className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition"
                                >
                                  Jadwal Ulang
                                </button>
                              )}

                            {appointment.status !==
                              'Dibatalkan' &&
                              appointment.status !==
                                'Selesai' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      appointment.id,
                                      'Dibatalkan'
                                    )
                                  }
                                  className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                                >
                                  Batalkan
                                </button>
                              )}

                            {appointment.status ===
                              'Dikonfirmasi' && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    'Selesai'
                                  )
                                }
                                className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                              >
                                Selesai
                              </button>
                            )}

                            {(appointment.status ===
                              'Selesai' ||
                              appointment.status ===
                                'Dibatalkan') && (
                              <span className="text-xs text-gray-400 px-2 py-1.5">
                                Tidak ada aksi
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      Belum ada appointment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showEditModal &&
        editingAppointment && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Jadwal Ulang Appointment
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Ubah dokter, tanggal, atau jam
                    appointment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={saveReschedule}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pasien
                  </label>

                  <input
                    type="text"
                    value={
                      editingAppointment.namaPasien
                    }
                    disabled
                    className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dokter
                  </label>

                  <input
                    type="text"
                    name="dokter"
                    value={
                      editingAppointment.dokter
                    }
                    onChange={handleEditChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal
                  </label>

                  <input
                    type="date"
                    name="tanggal"
                    value={
                      editingAppointment.tanggal
                    }
                    onChange={handleEditChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam
                  </label>

                  <input
                    type="time"
                    name="jam"
                    value={
                      editingAppointment.jam
                    }
                    onChange={handleEditChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

export default AppointmentAdmin;