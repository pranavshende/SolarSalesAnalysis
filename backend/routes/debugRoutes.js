const express = require('express');
const { restartMLService, getSystemStats, getLogs } = require('../controllers/debugController');
const router = express.Router();

router.post('/restart-ml', restartMLService);
router.get('/stats', getSystemStats);
router.get('/logs', getLogs);

module.exports = router;
