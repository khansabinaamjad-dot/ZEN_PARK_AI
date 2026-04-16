const express = require("express");
const router = express.Router();
const {
  detectPlate,
  getDashboard,
  getRecords,
  getAlerts
} = require("../controllers/parkingController");

router.post("/detect", detectPlate);
router.get("/dashboard", getDashboard);
router.get("/records", getRecords);
router.get("/alerts", getAlerts);

module.exports = router;