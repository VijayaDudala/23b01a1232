const weights = {
    Placement: 3,
    Result: 2,
    Event: 1
};

function calculatePriority(notification) {

    const weight = weights[notification.Type] || 0;

    const timestamp = new Date(notification.Timestamp).getTime();

    return {
        weight,
        timestamp
    };
}

module.exports = {
    calculatePriority
};