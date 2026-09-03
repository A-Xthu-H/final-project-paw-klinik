const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../db');
const config = require('../config/env');
const sendResponse = require('../utils/response');

function login(req, res, role) {
  const { email, password } = req.body || {};
  if (!email || !password) return sendResponse(res, { code: 400, success: false, message: 'Email dan password wajib diisi' });
  const user = database.prepare('SELECT id, nama, email, password_hash, role FROM users WHERE email = ? AND role = ?').get(email, role);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return sendResponse(res, { code: 401, success: false, message: 'Email atau password salah' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.nama }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return sendResponse(res, { code: 200, success: true, message: 'Login berhasil', data: { token, user: { id: user.id, name: user.nama, email: user.email, role: user.role } } });
}

function loginAdmin(req, res) { return login(req, res, 'admin'); }
function loginPasien(req, res) { return login(req, res, 'pasien'); }

module.exports = { loginAdmin, loginPasien };
