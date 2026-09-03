const sendResponse = require('../utils/response');

const ADMIN_ACCOUNT = {
  email: 'admin@klinik.com',
  password: 'admin123',
  role: 'admin',
  name: 'Admin Klinik',
};

const PASIEN_ACCOUNT = {
  email: 'pasien@klinik.com',
  password: 'pasien123',
  role: 'pasien',
  name: 'Budi Santoso',
};

function loginAdmin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'Email dan password wajib diisi',
    });
  }

  if (
    email !== ADMIN_ACCOUNT.email ||
    password !== ADMIN_ACCOUNT.password
  ) {
    return sendResponse(res, {
      code: 401,
      success: false,
      message: 'Email atau password salah',
    });
  }

  return sendResponse(res, {
    code: 200,
    success: true,
    message: 'Login admin berhasil',
    data: {
      user: {
        name: ADMIN_ACCOUNT.name,
        email: ADMIN_ACCOUNT.email,
        role: ADMIN_ACCOUNT.role,
      },
    },
  });
}

function loginPasien(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'Email dan password wajib diisi',
    });
  }

  if (
    email !== PASIEN_ACCOUNT.email ||
    password !== PASIEN_ACCOUNT.password
  ) {
    return sendResponse(res, {
      code: 401,
      success: false,
      message: 'Email atau password salah',
    });
  }

  return sendResponse(res, {
    code: 200,
    success: true,
    message: 'Login pasien berhasil',
    data: {
      user: {
        name: PASIEN_ACCOUNT.name,
        email: PASIEN_ACCOUNT.email,
        role: PASIEN_ACCOUNT.role,
      },
    },
  });
}

module.exports = {
  loginAdmin,
  loginPasien,
};