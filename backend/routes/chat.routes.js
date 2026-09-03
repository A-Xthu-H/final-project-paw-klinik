const express = require('express');
const { chat, history } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', chat);
router.get('/history/:sessionId', history);

module.exports = router;
