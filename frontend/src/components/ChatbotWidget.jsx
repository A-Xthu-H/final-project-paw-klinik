import { useState } from 'react';
import { useChatbot } from '../hooks/useChatbot';

const quickQuestions = [
  'Jadwal dokter hari ini',
  'Jam operasional klinik',
  'Layanan yang tersedia',
  'Cara pendaftaran pasien baru',
];

function readContext() {
  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  };

  return {
    knowledge: read('knowledge'),
    doctors: read('doctors'),
    schedules: read('schedules'),
  };
}

function ChatbotWidget({ embedded = false }) {
  const [open, setOpen] = useState(embedded);
  const [draft, setDraft] = useState('');
  const { messages, loading, error, sendMessage } = useChatbot();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = draft;
    setDraft('');
    await sendMessage(message, readContext());
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question, readContext());
  };

  const panel = (
    <div className={`flex flex-col overflow-hidden border border-teal-100 bg-white shadow-xl ${embedded ? 'rounded-2xl' : 'h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] rounded-2xl'}`}>
      <div className="flex items-center justify-between bg-teal-700 px-4 py-3 text-white">
        <div>
          <h2 className="font-bold">Chatbot Klinik</h2>
          <p className="text-xs text-teal-100">Jawaban dari basis pengetahuan klinik</p>
        </div>
        {!embedded && (
          <button type="button" onClick={() => setOpen(false)} className="text-xl" aria-label="Tutup chatbot">
            ×
          </button>
        )}
      </div>

      <div className="flex min-h-64 flex-1 flex-col gap-3 overflow-y-auto bg-teal-50 p-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-3 rounded-xl bg-white p-3 text-sm text-gray-600 shadow-sm">
            <p>Halo. Pilih pertanyaan berikut atau tulis pertanyaan Anda.</p>
            <div className="grid gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={loading}
                  className="rounded-lg border border-teal-200 px-3 py-2 text-left text-xs font-medium text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${message.role === 'user' ? 'self-end bg-teal-700 text-white' : 'self-start bg-white text-gray-700 shadow-sm'}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="self-start rounded-xl bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">Sedang mencari informasi...</div>}
        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t bg-white p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tulis pertanyaan..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          disabled={loading}
          aria-label="Pertanyaan chatbot"
        />
        <button type="submit" disabled={loading || !draft.trim()} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300">
          Kirim
        </button>
      </form>
    </div>
  );

  if (embedded) return panel;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? panel : (
        <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-teal-700 px-5 py-3 font-semibold text-white shadow-lg hover:bg-teal-800" aria-label="Buka chatbot">
          Chatbot Klinik
        </button>
      )}
    </div>
  );
}

export default ChatbotWidget;
