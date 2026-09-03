import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('chatSessionId');
    if (saved) return saved;
    const created = `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('chatSessionId', created);
    return created;
  });

  useEffect(() => {
    apiGet(`/api/chat/history/${sessionId}`)
      .then((result) => setMessages((result.data || []).map((item) => ({ role: item.role === 'ai' ? 'assistant' : 'user', content: item.pesan }))))
      .catch(() => {});
  }, [sessionId]);

  const sendMessage = async (message, context = {}, appointment) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    setMessages((current) => [
      ...current,
      { role: 'user', content: trimmedMessage },
    ]);
    setLoading(true);
    setError('');

    try {
      const result = await apiPost('/api/chat', {
        message: trimmedMessage,
        context,
        sessionId,
        appointment,
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.data?.answer || 'Maaf, jawaban belum tersedia.',
          fallback: result.data?.fallback,
        },
      ]);
    } catch (requestError) {
      setError('Chatbot sedang tidak dapat dihubungi. Coba lagi sebentar.');
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}
