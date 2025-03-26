const express = require('express');
const router = express();
const { UserController, upload } = require('../../controllers/UserControllers.js');

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.post('/verifyEmail', UserController.verifyEmail);

router.get('/profile/:id', UserController.profileUser);

router.post('/upload-avatar/:id', UserController.upload);

router.post('/upload-avatar/:id', upload, UserController.upload);

module.exports = router;
