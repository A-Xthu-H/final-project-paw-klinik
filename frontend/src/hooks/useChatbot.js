import { useState } from 'react';
import { apiPost } from '../utils/api';

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => `web-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const sendMessage = async (message, context = {}) => {
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
