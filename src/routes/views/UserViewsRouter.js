const express = require('express');
const router = express();
const {UserViews } = require('../../controllers/UserControllers.js');

router.get('/', UserViews.manageUser);

router.get('/:id', UserViews.detailsUser);

module.exports = router;
