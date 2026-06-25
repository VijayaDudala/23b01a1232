const express = require("express");

const router = express.Router();

const {
    notifyAll
} = require("../controllers/notificationController");

router.post("/notify-all", notifyAll);

module.exports = router;