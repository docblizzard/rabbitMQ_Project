const express = require('express');
const { sendMessage, getMessage } = require('../controllers/messageControllers');
const { createUserController, authenticateUserController } = require('../controllers/userControllers');

const router = express.Router();

router.post('/messages', sendMessage);
router.get('/messages', getMessage);
router.post('/user/register', createUserController)
router.post('/user/auth', authenticateUserController)


module.exports = router;