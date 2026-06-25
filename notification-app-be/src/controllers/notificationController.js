const notificationService = require("../services/notificationService");

exports.notifyAll = async (req, res) => {

    const { studentIds, message } = req.body;

    const result = await notificationService.notifyAll(studentIds, message);

    res.json(result);

};