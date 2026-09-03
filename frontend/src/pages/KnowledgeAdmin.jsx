import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiDelete, apiGet, apiPost, apiPut } from '../utils/api';

const initialKnowledge = [
  {
    id: 1,
    kategori: 'Profil Klinik',
    judul: 'Jam Operasional Klinik',
    konten:
      'Senin-Jumat 07:00-20:00, Sabtu 07:00-17:00, Minggu 08:00-14:00. IGD buka 24 jam.',
  },
  {
    id: 2,
    kategori: 'Layanan',
    judul: 'Poli Umum',
    konten:
      'Pemeriksaan kesehatan umum, keluhan ringan hingga sedang, surat rujukan, dan medical check up dasar.',
  },
  {
    id: 3,
    kategori: 'Prosedur',
    judul: 'Pendaftaran Pasien Baru',
    konten:
      'Pasien baru membawa KTP dan kartu BPJS/asuransi jika ada, kemudian mengisi data diri dan mengambil nomor antrean.',
  },
  {
    id: 4,
    kategori: 'FAQ',
    judul: 'Apakah klinik menerima BPJS?',
    konten:
      'Ya, Klinik Sehat Sentosa bekerja sama dengan BPJS Kesehatan.',
  },
];

const emptyForm = {
  kategori: '',
  judul: '',
  konten: '',
};

function KnowledgeAdmin() {
  const navigate = useNavigate();

  const [knowledge, setKnowledge] = useState(initialKnowledge);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loadError, setLoadError] = useState('');
  const [operationError, setOperationError] = useState('');

  useEffect(() => { apiGet('/api/knowledge').then((result) => setKnowledge(result.data || [])).catch(() => setLoadError('Basis pengetahuan tidak dapat dimuat. Pastikan backend aktif.')); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      kategori: item.kategori,
      judul: item.judul,
      konten: item.konten,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationError('');

    try {
      if (editingId !== null) {
      const updatedKnowledge = knowledge.map((item) =>
        item.id === editingId
          ? {
              ...item,
              ...form,
            }
          : item
      );

      const result = await apiPut(`/api/knowledge/${editingId}`, form);
      setKnowledge((current) => current.map((item) => item.id === editingId ? result.data : item));
      } else {
      const newKnowledge = {
        id: Date.now(),
        ...form,
      };

      const updatedKnowledge = [
        ...knowledge,
        newKnowledge,
      ];

      const result = await apiPost('/api/knowledge', form);
      setKnowledge((current) => [...current, result.data]);
      }
    } catch (error) {
      setOperationError(error.message || 'Informasi gagal disimpan.');
      return;
    }

    closeModal();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const updatedKnowledge = knowledge.filter(
      (item) => item.id !== deleteTarget.id
    );

    try {
      await apiDelete(`/api/knowledge/${deleteTarget.id}`);
    } catch (error) {
      setOperationError(error.message || 'Informasi gagal dihapus.');
      return;
    }
    setKnowledge((current) => current.filter((item) => item.id !== deleteTarget.id));

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Basis Pengetahuan
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
        {operationError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{operationError}</div>}
        {loadError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Data Basis Pengetahuan
            </h2>

            <p className="text-gray-500 mt-1">
              Informasi ini digunakan sebagai sumber jawaban chatbot.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-lg transition"
          >
            + Tambah Informasi
          </button>
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
                    Kategori
                  </th>

                  <th className="px-5 py-4">
                    Judul
                  </th>

                  <th className="px-5 py-4">
                    Konten
                  </th>

                  <th className="px-5 py-4 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {knowledge.length > 0 ? (
                  knowledge.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.kategori}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {item.judul}
                      </td>

                      <td className="px-5 py-4 text-gray-600 max-w-md">
                        {item.konten}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(item)
                            }
                            className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(item)
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
                      colSpan="5"
                      className="px-5 py-12 text-center text-gray-500"
                    >
                      Belum ada data basis pengetahuan.
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
                    ? 'Edit Informasi'
                    : 'Tambah Informasi'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Data ini akan digunakan sebagai basis pengetahuan chatbot.
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
                  Kategori
                </label>

                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">
                    Pilih kategori
                  </option>

                  <option value="Profil Klinik">
                    Profil Klinik
                  </option>

                  <option value="Layanan">
                    Layanan
                  </option>

                  <option value="Prosedur">
                    Prosedur
                  </option>

                  <option value="FAQ">
                    FAQ
                  </option>

                  <option value="Informasi Lain">
                    Informasi Lain
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul
                </label>

                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Jam Operasional Klinik"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten
                </label>

                <textarea
                  name="konten"
                  value={form.konten}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Masukkan informasi klinik..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
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
                    : 'Simpan Informasi'}
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
              Hapus Informasi?
            </h3>

            <p className="text-gray-500 mt-3">
              Informasi{' '}
              <span className="font-semibold text-gray-700">
                {deleteTarget.judul}
              </span>{' '}
              akan dihapus dari basis pengetahuan.
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

export default KnowledgeAdmin;