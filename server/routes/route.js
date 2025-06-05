const express = require('express');
const getInfo = require('../controllers/info-controller.js').getInfo;

const router = express.Router();
router.get("/analyze/:query", getInfo);

module.exports = router;