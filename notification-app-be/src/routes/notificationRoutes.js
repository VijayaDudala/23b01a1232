const express = require("express");

const router = express.Router();

const {
    notifyAll,
    getTopNotifications
} = require("../controllers/notificationController");

router.post("/notify-all", notifyAll);

router.get("/notifications", getTopNotifications);

module.exports = router;