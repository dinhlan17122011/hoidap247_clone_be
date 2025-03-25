const express = require('express');
const router = express();
const { UserController } = require('../../controllers/UserControllers.js');

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/verifyEmail', UserController.verifyEmail);

router.get('/profile/:id', UserController.profileUser);

router.delete('/:id', UserController.deleteUser);

module.exports = router;
