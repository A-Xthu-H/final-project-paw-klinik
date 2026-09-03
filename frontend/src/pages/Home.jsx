import { Link } from 'react-router-dom';
import HealthBadge from '../components/HealthBadge';
import { useHealthCheck } from '../hooks/useHealthCheck';

function Home() {
  const { status, data, checkHealth } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏥</div>

          <h1 className="text-3xl font-bold text-gray-800">
            Klinik Sehat Sentosa
          </h1>

          <p className="text-gray-500 mt-2">
            Sistem Informasi Klinik
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <HealthBadge status={status} />
        </div>

        {data && (
          <div className="bg-gray-50 border rounded-xl p-4 mb-6">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/login/pasien"
            className="text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login Pasien
          </Link>

          <Link
            to="/login/admin"
            className="text-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition"
          >
            Login Admin
          </Link>
        </div>

        <button
          onClick={checkHealth}
          className="w-full mt-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition"
        >
          Cek Backend
        </button>
      </div>
    </div>
  );
}

export default Home;