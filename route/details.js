const express = require('express');
const DetailsController = require('../controllers/details');
const router   = express.Router();

router.route('/')
    .get(DetailsController.getLandmarkDetails)

module.exports = router;
