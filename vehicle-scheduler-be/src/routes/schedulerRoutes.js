const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const schedulerController = require("../controllers/schedulerController");

router.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

router.get(
    "/schedule",
    authMiddleware,
    schedulerController.scheduleVehicles
);

module.exports = router;