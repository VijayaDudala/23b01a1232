const Queue = require("../utils/queue");

const emailService = require("./emailService");
const pushService = require("./pushService");
const dbService = require("./dbService");

exports.notifyAll = async (studentIds, message) => {

    const queue = new Queue();

    studentIds.forEach(id => {
        queue.add({
            studentId: id,
            message
        });
    });

    let success = 0;
    let failed = 0;

    await queue.process(async (job) => {

        try {

            await dbService.saveNotification(job.studentId, job.message);

            let retries = 3;
            let emailSent = false;

            while (retries > 0 && !emailSent) {

                try {

                    await emailService.sendEmail(job.studentId, job.message);
                    emailSent = true;

                } catch (err) {

                    retries--;

                    console.log(
                        `Retry for Student ${job.studentId}. Remaining: ${retries}`
                    );

                    if (retries === 0) {
                        throw err;
                    }

                }

            }

            await pushService.pushNotification(job.studentId, job.message);

            success++;

        } catch (err) {

            console.log(
                `❌ Notification Failed for ${job.studentId}`
            );

            failed++;

        }

    });

    return {

        success: true,

        totalStudents: studentIds.length,

        successCount: success,

        failedCount: failed

    };

};