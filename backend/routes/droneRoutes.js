const express = require('express');
const router = express.Router();
const droneController = require("../controllers/droneController.js");

router.get('/drones', droneController.getDrones)

module.exports = router;