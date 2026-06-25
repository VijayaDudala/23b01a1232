const api = require("../config/axiosConfig");

let token = null;

async function getAccessToken() {

    if (token) return token;

    const response = await api.post("/auth", {
        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLLNO,
        accessCode: process.env.ACCESS_CODE,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    token = response.data.access_token;

    return token;
}

module.exports = {
    getAccessToken
};