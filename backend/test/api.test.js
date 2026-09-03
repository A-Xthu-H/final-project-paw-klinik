process.env.GEMINI_API_KEY = '';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');
const database = require('../db');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  database.close();
});

async function request(path, method = 'GET', body, token) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, body: await response.json() };
}

test('health endpoint is available', async () => {
  const result = await request('/health');
  assert.equal(result.status, 200);
  assert.equal(result.body.data.status, 'ok');
});

test('admin and patient login return JWT', async () => {
  const admin = await request('/api/auth/admin/login', 'POST', { email: 'admin@klinik.com', password: 'admin123' });
  const pasien = await request('/api/auth/pasien/login', 'POST', { email: 'pasien@klinik.com', password: 'pasien123' });
  assert.equal(admin.status, 200);
  assert.equal(pasien.status, 200);
  assert.ok(admin.body.data.token);
  assert.ok(pasien.body.data.token);
});

test('admin endpoint rejects patient token', async () => {
  const login = await request('/api/auth/pasien/login', 'POST', { email: 'pasien@klinik.com', password: 'pasien123' });
  const result = await request('/api/appointments', 'GET', undefined, login.body.data.token);
  assert.equal(result.status, 403);
});

test('chat stores history and returns fallback for unknown information', async () => {
  const sessionId = `test-${Date.now()}`;
  const result = await request('/api/chat', 'POST', { message: 'informasi yang tidak terdaftar', sessionId });
  const history = await request(`/api/chat/history/${sessionId}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.data.fallback, true);
  assert.equal(history.body.data.length, 2);
});

test('patient booking rejects a date outside schedule day', async () => {
  const login = await request('/api/auth/pasien/login', 'POST', { email: 'pasien@klinik.com', password: 'pasien123' });
  const result = await request('/api/appointments', 'POST', {
    namaPasien: 'Budi Santoso', kontak: '081234567890', doctor_id: 1, schedule_id: 1, tanggal: '2026-09-09', jam: '09:00',
  }, login.body.data.token);
  assert.equal(result.status, 400);
});

test('public schedules and chatbot sources are available', async () => {
  const schedules = await request('/api/schedules');
  const chat = await request('/api/chat', 'POST', { message: 'jadwal dokter', sessionId: `test-schedule-${Date.now()}` });
  assert.equal(schedules.status, 200);
  assert.ok(schedules.body.data.length > 0);
  assert.equal(chat.status, 200);
  assert.equal(chat.body.data.fallback, false);
});
