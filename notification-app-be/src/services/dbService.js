exports.saveNotification = async (studentId, message) => {

    console.log(`💾 Saved notification for ${studentId}`);

    return {
        studentId,
        status: "SAVED",
        message
    };

};