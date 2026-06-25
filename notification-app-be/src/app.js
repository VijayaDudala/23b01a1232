const express = require("express");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(express.json());

app.use("/api", notificationRoutes);

module.exports = app;