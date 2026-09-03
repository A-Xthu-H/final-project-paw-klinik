import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

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

  const doctors = getLocalStorageData('doctors');
  const schedules = getLocalStorageData('schedules');
  const appointments = getLocalStorageData('appointments');

  const activeSchedules = schedules.filter(
    (schedule) => schedule.status === 'Aktif'
  );

  const latestAppointments = [...appointments]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const stats = [
    {
      title: 'Jumlah Dokter',
      value: doctors.length,
      description: 'Dokter terdaftar',
      icon: '👨‍⚕️',
    },
    {
      title: 'Jadwal Aktif',
      value: activeSchedules.length,
      description: 'Jadwal praktik aktif',
      icon: '📅',
    },
    {
      title: 'Appointment',
      value: appointments.length,
      description: 'Total appointment',
      icon: '📝',
    },
  ];

  const menus = [
    {
      title: 'Kelola Dokter',
      description: 'Tambah, ubah, lihat, dan hapus data dokter.',
      icon: '👨‍⚕️',
      path: '/admin/dokter',
    },
    {
      title: 'Kelola Jadwal',
      description: 'Atur jadwal praktik dan kuota dokter.',
      icon: '📅',
      path: '/admin/jadwal',
    },
    {
      title: 'Basis Pengetahuan',
      description: 'Kelola informasi yang digunakan chatbot.',
      icon: '📚',
      path: '/admin/knowledge',
    },
    {
      title: 'Appointment',
      description: 'Lihat dan kelola appointment pasien.',
      icon: '📝',
      path: '/admin/appointment',
    },
  ];

  const statusClasses = {
    Menunggu: 'bg-yellow-100 text-yellow-700',
    Dikonfirmasi: 'bg-green-100 text-green-700',
    Dibatalkan: 'bg-red-100 text-red-700',
    Selesai: 'bg-blue-100 text-blue-700',
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');

    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
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
                Dashboard Administrator
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Selamat Datang, Admin 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Berikut ringkasan informasi Klinik Sehat Sentosa.
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.title}
                  </p>

                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    {item.value}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Admin */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Menu Admin
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Pilih menu untuk mengelola data klinik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menus.map((menu) => (
              <button
                key={menu.title}
                type="button"
                onClick={() => handleMenuClick(menu.path)}
                className="text-left border border-gray-200 rounded-xl p-5 transition hover:border-teal-400 hover:bg-teal-50 cursor-pointer"
              >
                <div className="text-3xl mb-4">
                  {menu.icon}
                </div>

                <h4 className="font-semibold text-gray-800">
                  {menu.title}
                </h4>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {menu.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Appointment Terbaru */}
        <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Appointment Terbaru
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Daftar appointment pasien terbaru.
              </p>
            </div>

            {appointments.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate('/admin/appointment')
                }
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Lihat Semua →
              </button>
            )}
          </div>

          {latestAppointments.length > 0 ? (
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
                  {latestAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b last:border-b-0"
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
                    )
                  )}
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
                Data appointment terbaru akan tampil di sini.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;