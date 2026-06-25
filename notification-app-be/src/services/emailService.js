exports.sendEmail = async (studentId, message) => {

    // Simulate failure for student 103
    if (studentId === 103) {
        throw new Error("Email Service Failed");
    }

    console.log(`📧 Email sent to ${studentId}`);

    return {
        studentId,
        status: "EMAIL_SENT",
        message
    };
};