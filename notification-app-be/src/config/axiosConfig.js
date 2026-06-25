const axios = require("axios");

const { getToken } = require("../services/authService");

const api = axios.create({
    baseURL: "http://4.224.186.213/evaluation-service"
});

api.interceptors.request.use(async (config) => {

    const token = await getToken();

    config.headers.Authorization = `Bearer ${token}`;

    return config;

});

module.exports = api;