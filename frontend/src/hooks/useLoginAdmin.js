import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';

export function useLoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await apiPost('/api/auth/admin/login', {
        email,
        password,
      });

      if (result.success) {
        localStorage.setItem('adminLoggedIn', 'true');

        localStorage.setItem(
          'adminUser',
          JSON.stringify(result.data.user)
        );

        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}