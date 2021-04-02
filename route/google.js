const express = require('express');
const GoogleController = require('../controllers/google');
const router   = express.Router();

router.route('/')
    .get(GoogleController.getLandmarks)

module.exports = router;
