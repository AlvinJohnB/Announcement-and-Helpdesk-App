const express = require("express");
const router = express.Router();
const qcTestController = require("../../controllers/qcTestController");

// GET all QC tests
router.get("/", qcTestController.getAllQCTests);

// POST create a new QC test
router.post("/", qcTestController.createQCTest);

// DELETE a QC test
router.delete("/:id", qcTestController.deleteQCTest);

module.exports = router;
