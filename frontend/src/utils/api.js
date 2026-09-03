const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper untuk GET request ke backend.
 */
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });

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
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function apiPut(path, body) {
  return apiRequest(path, 'PUT', body);
}

export async function apiPatch(path, body) {
  return apiRequest(path, 'PATCH', body);
}

export async function apiDelete(path) {
  return apiRequest(path, 'DELETE');
}

export async function apiRequest(path, method, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!res.ok) throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  return res.json();
}

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}