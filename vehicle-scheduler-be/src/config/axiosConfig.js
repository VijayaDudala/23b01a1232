const axios = require("axios");

const api = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 15000
});

module.exports = api;