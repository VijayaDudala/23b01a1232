require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const schedulerRoutes = require("./routes/schedulerRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Vehicle Scheduler API Running"
    });
});

app.use("/api", schedulerRoutes);

module.exports = app;