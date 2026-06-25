const axios = require("axios");

let token = null;

async function getToken() {

    if (token) return token;

    const response = await axios.post(
        "http://4.224.186.213/evaluation-service/auth",
        {
            email: process.env.EMAIL,
            name: process.env.NAME,
            rollNo: process.env.ROLL_NO,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }
    );

    token = response.data.access_token;

    return token;
}

module.exports = {
    getToken
};