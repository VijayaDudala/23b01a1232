const { getDepots } = require("./depotService");
const { getVehicles } = require("./vehicleService");
const knapsack = require("../utils/knapsack");

async function scheduleVehicles(token) {

    const depots = await getDepots(token);
    const vehicles = await getVehicles(token);

    const result = [];

    for (const depot of depots) {

        const best = knapsack(vehicles, depot.MechanicHours);

        // Add these lines
        const usedHours = best.selectedVehicles.reduce(
            (sum, task) => sum + task.Duration,
            0
        );

        const remainingHours = depot.MechanicHours - usedHours;

        // Replace your existing result.push() with this
        result.push({
            depotID: depot.ID,
            mechanicHours: depot.MechanicHours,
            usedHours,
            remainingHours,
            totalTasks: best.selectedVehicles.length,
            totalImpact: best.totalImpact,
            tasks: best.selectedVehicles
        });

    }

    return result;
}

module.exports = {
    scheduleVehicles
};