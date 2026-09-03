const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper untuk GET request ke backend.
 */
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Wrapper untuk POST request JSON ke backend.
 */
export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}