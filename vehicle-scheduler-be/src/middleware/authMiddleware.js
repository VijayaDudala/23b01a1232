const { getAccessToken } = require("../services/authService");

async function authMiddleware(req, res, next) {

    try {

        const token = await getAccessToken();

        req.token = token;

        next();

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Authentication Failed"
        });

    }

}

module.exports = authMiddleware;