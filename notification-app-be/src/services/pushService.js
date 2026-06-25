exports.pushNotification = async (studentId, message) => {
    console.log(`📱 Push sent to ${studentId}`);

    return {
        studentId,
        status: "PUSH_SENT",
        message
    };
};