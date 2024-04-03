const express = require('express');
const { sendMessage } = require('../controllers/messageControllers');

const router = express.Router();

router.post('/messages', sendMessage);
// router.get('/messages', getMessage);

module.exports = router;