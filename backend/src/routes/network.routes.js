const express = require('express');
const router = express.Router();
const controller = require('../controllers/network.controller');

router.get('/scan', controller.scanNetwork);
router.get('/devices', controller.getDevices);
router.get('/devices/:id/status', controller.getDeviceStatus);
router.post('/devices/:id/config', controller.configureDevice);
router.get('/topology', controller.getTopology);
router.get('/logs', controller.getLogs);

module.exports = router;
