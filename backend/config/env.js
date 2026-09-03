require('dotenv').config();

/**
 * Semua env variable dibaca SEKALI di sini, bukan langsung process.env
 * tersebar di banyak file. Kalo nambah env variable baru, tinggal
 * tambahin di sini, terus import { config } di file yang butuh -
 * gampang dicari ada env apa aja yang dipake project ini.
 */
const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'klinik-development-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
};

module.exports = config;
