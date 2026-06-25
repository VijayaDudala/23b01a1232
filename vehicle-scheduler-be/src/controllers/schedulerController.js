const {
    scheduleVehicles
} = require("../services/schedulerService");

async function schedule(req, res) {

    try {

        const result = await scheduleVehicles(req.token);

        res.json({

            success: true,

            depots: result

        });

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

}

module.exports = {

    scheduleVehicles: schedule

};