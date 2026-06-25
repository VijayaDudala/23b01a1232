const notificationService = require("../services/notificationService");

exports.notifyAll = async (req, res) => {

    const { studentIds, message } = req.body;

    const result = await notificationService.notifyAll(
        studentIds,
        message
    );

    res.json(result);

};

exports.getTopNotifications = async (req, res) => {

    try {

        const notifications =
            await notificationService.fetchTopNotifications(10);

        res.json({

            success: true,

            count: notifications.length,

            notifications

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};