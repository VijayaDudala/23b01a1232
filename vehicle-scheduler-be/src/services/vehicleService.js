const api = require("../config/axiosConfig");

async function getVehicles(token) {
    const response = await api.get("/vehicles", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data.vehicles;
}

module.exports = {
    getVehicles
};