const express = require('express');
const router = express();
const UserControllers = require('../controllers/UserControllers.js');

router.post('/register', UserControllers.register);

router.post('/login', UserControllers.login);

router.post('/verifyEmail', UserControllers.verifyEmail);

router.get('/profile/:id', UserControllers.profileUser);

module.exports = router;
