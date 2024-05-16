const express = require('express');
const { createUserController } = require('../controllers/userControllers');

const router = express.Router();

router.post('/user/register', createUserController)

module.exports = router;