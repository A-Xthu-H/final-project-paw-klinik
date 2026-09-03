const sendResponse = require('../utils/response');
const database = require('../db');
const config = require('../config/env');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { buildDocuments, formatDocument } = require('../services/rag.service');

const knowledgeFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'knowledgeBase.json'), 'utf8'));

const defaultKnowledge = [
  {
    kategori: 'Profil Klinik',
    judul: 'Jam Operasional Klinik',
    konten: 'Senin-Jumat 07:00-20:00, Sabtu 07:00-17:00, Minggu 08:00-14:00. IGD buka 24 jam.',
  },
  {
    kategori: 'Layanan',
    judul: 'Poli Umum',
    konten: 'Pemeriksaan kesehatan umum, keluhan ringan hingga sedang, surat rujukan, dan medical check up dasar.',
  },
  {
    kategori: 'Prosedur',
    judul: 'Pendaftaran Pasien Baru',
    konten: 'Pasien baru membawa KTP dan kartu BPJS/asuransi jika ada, kemudian mengisi data diri dan mengambil nomor antrean.',
  },
  {
    kategori: 'FAQ',
    judul: 'Apakah klinik menerima BPJS?',
    konten: 'Ya, Klinik Sehat Sentosa bekerja sama dengan BPJS Kesehatan.',
  },
];

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function termFrequency(words) {
  return words.reduce((result, word) => {
    result[word] = (result[word] || 0) + 1;
    return result;
  }, {});
}

function retrieve(message, context = {}) {
  const documents = [
    ...buildDocuments(knowledgeFile, database),
    ...(Array.isArray(context.knowledge) && context.knowledge.length > 0
      ? context.knowledge
      : defaultKnowledge),
    ...(Array.isArray(context.doctors) ? context.doctors : []),
    ...(Array.isArray(context.schedules) ? context.schedules : []),
  ];
  const queryWords = normalize(message);
  const corpus = documents.map((document) => normalize(`${document.kategori || ''} ${document.judul || ''} ${document.konten || ''} ${document.nama || ''} ${document.spesialisasi || ''} ${document.dokter || ''} ${document.hari || ''} ${document.jam || ''} ${document.jamMulai || ''} ${document.jamSelesai || ''}`));
  const queryFrequency = termFrequency(queryWords);
  const documentFrequency = {};
  corpus.forEach((words) => new Set(words).forEach((word) => { documentFrequency[word] = (documentFrequency[word] || 0) + 1; }));
  const vectorScore = (words) => {
    const frequency = termFrequency(words);
    let score = 0;
    Object.keys(queryFrequency).forEach((word) => {
      if (!frequency[word]) return;
      const inverseFrequency = Math.log((documents.length + 1) / ((documentFrequency[word] || 0) + 1)) + 1;
      score += queryFrequency[word] * frequency[word] * inverseFrequency * inverseFrequency;
    });
    return score;
  };

  return documents
    .map((document, index) => ({ document, score: vectorScore(corpus[index]) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.document);
}

const embeddingCache = new Map();

async function embedText(text) {
  if (!config.geminiApiKey) return null;
  if (embeddingCache.has(text)) return embeddingCache.get(text);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.geminiEmbeddingModel}:embedContent?key=${config.geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: `models/${config.geminiEmbeddingModel}`, content: { parts: [{ text }] } }),
  });
  if (!response.ok) throw new Error('Gemini embedding request failed');
  const values = (await response.json()).embedding?.values;
  if (!values) throw new Error('Gemini embedding response invalid');
  embeddingCache.set(text, values);
  return values;
}

function cosineSimilarity(left, right) {
  const dot = left.reduce((sum, value, index) => sum + value * right[index], 0);
  const leftSize = Math.sqrt(left.reduce((sum, value) => sum + value * value, 0));
  const rightSize = Math.sqrt(right.reduce((sum, value) => sum + value * value, 0));
  return leftSize && rightSize ? dot / (leftSize * rightSize) : 0;
}

async function generateWithGemini(question, sources) {
  if (!config.geminiApiKey) return null;
  const prompt = `Jawab pertanyaan pasien hanya berdasarkan konteks berikut. Jika konteks tidak cukup, katakan informasinya tidak tersedia.\n\nKonteks:\n${sources.map(formatDocument).join('\n')}\n\nPertanyaan: ${question}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!response.ok) throw new Error('Gemini request failed');
  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function chat(req, res) {
  const { message, context, sessionId = `session-${Date.now()}`, appointment } = req.body || {};

  if (!message || !String(message).trim()) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'Pertanyaan wajib diisi',
    });
  }

  let results = retrieve(message, context);
  let semantic = false;
  try {
    const queryEmbedding = await embedText(message);
    if (queryEmbedding) {
      const documents = [...database.prepare('SELECT kategori, judul, konten FROM knowledge_base').all(), ...database.prepare('SELECT nama, spesialisasi, deskripsi FROM doctors').all(), ...database.prepare("SELECT d.nama AS dokter, s.hari, s.jam_mulai AS jamMulai, s.jam_selesai AS jamSelesai, s.kuota FROM schedules s JOIN doctors d ON d.id = s.doctor_id WHERE s.status = 'Aktif'").all()];
      const semanticResults = [];
      for (const document of documents) {
        const embedding = await embedText(formatDocument(document));
        if (embedding) semanticResults.push({ document, score: cosineSimilarity(queryEmbedding, embedding) });
      }
      const relevant = semanticResults.filter((item) => item.score >= 0.35).sort((left, right) => right.score - left.score).slice(0, 3).map((item) => item.document);
      if (relevant.length) { results = relevant; semantic = true; }
    }
  } catch (error) {
    console.error('Embedding fallback:', error.message);
  }
  database.prepare('INSERT INTO chat_history (session_id, pesan, role) VALUES (?, ?, ?)').run(sessionId, message, 'user');

  if (appointment) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    let user;
    try { user = token ? jwt.verify(token, config.jwtSecret) : null; } catch { user = null; }
    if (!user || user.role !== 'pasien') return sendChatAnswer(res, sessionId, 'Silakan login sebagai pasien terlebih dahulu untuk membuat appointment melalui chatbot.', true, []);
    const schedule = database.prepare("SELECT * FROM schedules WHERE id = ? AND doctor_id = ? AND status = 'Aktif'").get(appointment.schedule_id, appointment.doctor_id);
    const valid = schedule && appointment.tanggal && appointment.jam && appointment.kontak && matchesScheduleDay(appointment.tanggal, schedule.hari) && appointment.jam >= schedule.jam_mulai && appointment.jam < schedule.jam_selesai;
    if (!valid) return sendChatAnswer(res, sessionId, 'Tanggal atau jam yang dipilih belum sesuai jadwal dokter. Silakan periksa kembali.', true, []);
    const create = database.transaction(() => {
      const booked = database.prepare("SELECT COUNT(*) AS count FROM appointments WHERE schedule_id = ? AND tanggal = ? AND status != 'Dibatalkan'").get(appointment.schedule_id, appointment.tanggal).count;
      if (booked >= schedule.kuota) return null;
      return database.prepare('INSERT INTO appointments (pasien_id, nama_pasien, kontak_pasien, doctor_id, schedule_id, tanggal, jam, sumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(user.id, user.name, appointment.kontak, appointment.doctor_id, appointment.schedule_id, appointment.tanggal, appointment.jam, 'chat');
    });
    const created = create();
    if (!created) return sendChatAnswer(res, sessionId, 'Maaf, slot tersebut sudah penuh. Silakan pilih jadwal lain.', true, []);
    return sendChatAnswer(res, sessionId, 'Appointment berhasil dibuat melalui chatbot dan menunggu konfirmasi admin.', false, []);
  }

  if (results.length === 0) {
    const answer = 'Maaf, informasi tersebut belum tersedia di basis pengetahuan Klinik Sehat Sentosa. Silakan hubungi admin klinik untuk informasi lebih lanjut.';
    database.prepare('INSERT INTO chat_history (session_id, pesan, role) VALUES (?, ?, ?)').run(sessionId, answer, 'ai');
    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Informasi tidak ditemukan',
      data: {
        answer,
        sources: [],
        fallback: true,
        sessionId,
      },
    });
  }

  let answer = results.map(formatDocument).join(' ');
  let generated = false;
  try {
    const llmAnswer = await generateWithGemini(message, results);
    if (llmAnswer) { answer = llmAnswer; generated = true; }
  } catch (error) {
    console.error('LLM fallback:', error.message);
  }
  database.prepare('INSERT INTO chat_history (session_id, pesan, role) VALUES (?, ?, ?)').run(sessionId, answer, 'ai');

  return sendResponse(res, {
    code: 200,
    success: true,
    message: 'Jawaban berhasil dibuat dari basis pengetahuan',
    data: {
      answer,
      sources: results,
      fallback: false,
      generated,
      semantic,
      sessionId,
    },
  });
}

function matchesScheduleDay(date, day) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[new Date(`${date}T00:00:00`).getDay()] === day;
}

function sendChatAnswer(res, sessionId, answer, fallback, sources) {
  database.prepare('INSERT INTO chat_history (session_id, pesan, role) VALUES (?, ?, ?)').run(sessionId, answer, 'ai');
  return sendResponse(res, { code: 200, success: true, message: 'Jawaban berhasil dibuat', data: { answer, sources, fallback, generated: false, sessionId } });
}

function history(req, res) {
  const rows = database.prepare('SELECT id, session_id AS sessionId, pesan, role, timestamp FROM chat_history WHERE session_id = ? ORDER BY id ASC').all(req.params.sessionId);
  return sendResponse(res, { code: 200, success: true, message: 'Riwayat chat berhasil diambil', data: rows });
}

module.exports = { chat, history };
