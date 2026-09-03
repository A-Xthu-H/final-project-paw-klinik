import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasienDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState('home');

  const pasienUser = JSON.parse(
    localStorage.getItem('pasienUser') || '{}'
  );

  const getLocalStorageData = (key) => {
    try {
      const data = localStorage.getItem(key);

      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Gagal membaca ${key}:`, error);
    }

    return [];
  };

  const schedules = getLocalStorageData('schedules');
  const appointments = getLocalStorageData('appointments');

  const activeSchedules = schedules.filter(
    (schedule) => schedule.status === 'Aktif'
  );

  const myAppointments = appointments.filter(
    (appointment) =>
      appointment.namaPasien === pasienUser.name
  );

  const handleLogout = () => {
    localStorage.removeItem('pasienLoggedIn');
    localStorage.removeItem('pasienUser');

    navigate('/');
  };

  const statusClasses = {
    Menunggu: 'bg-yellow-100 text-yellow-700',
    Dikonfirmasi: 'bg-green-100 text-green-700',
    Dibatalkan: 'bg-red-100 text-red-700',
    Selesai: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              🏥
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Klinik Sehat Sentosa
              </h1>

              <p className="text-sm text-gray-500">
                Halaman Pasien
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Selamat Datang, {pasienUser.name || 'Pasien'} 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Temukan informasi layanan dan jadwal dokter Klinik Sehat Sentosa.
          </p>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => setActiveMenu('jadwal')}
            className={`bg-white border rounded-2xl p-6 text-left shadow-sm transition ${
              activeMenu === 'jadwal'
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
            }`}
          >
            <div className="text-3xl mb-4">
              👨‍⚕️
            </div>

            <h3 className="font-semibold text-gray-800">
              Jadwal Dokter
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Lihat jadwal praktik dokter yang tersedia.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveMenu('appointment')}
            className={`bg-white border rounded-2xl p-6 text-left shadow-sm transition ${
              activeMenu === 'appointment'
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
            }`}
          >
            <div className="text-3xl mb-4">
              📝
            </div>

            <h3 className="font-semibold text-gray-800">
              Appointment Saya
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Lihat status appointment dan jadwal konsultasi.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveMenu('chatbot')}
            className={`bg-white border rounded-2xl p-6 text-left shadow-sm transition ${
              activeMenu === 'chatbot'
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
            }`}
          >
            <div className="text-3xl mb-4">
              💬
            </div>

            <h3 className="font-semibold text-gray-800">
              Chatbot Klinik
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Tanyakan informasi klinik melalui asisten AI.
            </p>
          </button>
        </div>

        {/* Informasi Akun */}
        {activeMenu === 'home' && (
          <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800">
              Informasi Akun
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div>
                <span className="text-gray-500">
                  Nama:
                </span>{' '}
                <span className="font-medium text-gray-800">
                  {pasienUser.name || '-'}
                </span>
              </div>

              <div>
                <span className="text-gray-500">
                  Email:
                </span>{' '}
                <span className="font-medium text-gray-800">
                  {pasienUser.email || '-'}
                </span>
              </div>

              <div>
                <span className="text-gray-500">
                  Role:
                </span>{' '}
                <span className="font-medium text-gray-800">
                  {pasienUser.role || 'pasien'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Jadwal Dokter */}
        {activeMenu === 'jadwal' && (
          <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Jadwal Dokter
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Jadwal praktik dokter yang sedang aktif.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMenu('home')}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Kembali
              </button>
            </div>

            {activeSchedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3">
                        Dokter
                      </th>
                      <th className="px-4 py-3">
                        Hari
                      </th>
                      <th className="px-4 py-3">
                        Jam Praktik
                      </th>
                      <th className="px-4 py-3">
                        Kuota
                      </th>
                      <th className="px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeSchedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 font-medium text-gray-800">
                          {schedule.dokter}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {schedule.hari}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {schedule.jamMulai} -{' '}
                          {schedule.jamSelesai}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {schedule.kuota}
                        </td>

                        <td className="px-4 py-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {schedule.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl py-10 text-center">
                <div className="text-4xl mb-3">
                  📅
                </div>

                <p className="font-medium text-gray-700">
                  Belum ada jadwal aktif
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Jadwal praktik dokter akan tampil di sini.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Appointment */}
        {activeMenu === 'appointment' && (
          <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Appointment Saya
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Lihat jadwal dan status appointment Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMenu('home')}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Kembali
              </button>
            </div>

            {myAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3">
                        Pasien
                      </th>
                      <th className="px-4 py-3">
                        Dokter
                      </th>
                      <th className="px-4 py-3">
                        Tanggal
                      </th>
                      <th className="px-4 py-3">
                        Jam
                      </th>
                      <th className="px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {myAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 font-medium text-gray-800">
                          {appointment.namaPasien}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {appointment.dokter}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {appointment.tanggal}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {appointment.jam}
                        </td>

                        <td className="px-4 py-4">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl py-10 text-center">
                <div className="text-4xl mb-3">
                  📭
                </div>

                <p className="font-medium text-gray-700">
                  Belum ada appointment
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Belum ada appointment untuk akun ini.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Chatbot */}
        {activeMenu === 'chatbot' && (
          <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Chatbot Klinik
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Asisten informasi Klinik Sehat Sentosa.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMenu('home')}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Kembali
              </button>
            </div>

            <div className="border border-dashed border-teal-300 bg-teal-50 rounded-xl py-12 px-6 text-center">
              <div className="text-5xl mb-4">
                🤖
              </div>

              <h4 className="font-bold text-gray-800 text-lg">
                Chatbot Klinik
              </h4>

              <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
                Fitur chatbot akan menggunakan basis
                pengetahuan klinik untuk menjawab pertanyaan
                pasien.
              </p>

              <div className="inline-block mt-5 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                Menunggu integrasi RAG / AI
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PasienDashboard;