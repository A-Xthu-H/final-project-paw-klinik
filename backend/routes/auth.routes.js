const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  loginPasien,
} = require('../controllers/auth.controller');

router.post('/admin/login', loginAdmin);
router.post('/pasien/login', loginPasien);

module.exports = router;