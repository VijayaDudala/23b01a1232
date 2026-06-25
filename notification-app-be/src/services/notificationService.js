const api = require("../config/axiosConfig");
const { calculatePriority } = require("../utils/priority");
const MinHeap = require("../utils/minHeap");

const Queue = require("../utils/queue");
const emailService = require("./emailService");
const pushService = require("./pushService");
const dbService = require("./dbService");

/* ---------------------- Stage 5 ---------------------- */

async function notifyAll(studentIds, message) {

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

                    await emailService.sendEmail(
                        job.studentId,
                        job.message
                    );

                    emailSent = true;

                } catch (err) {

                    retries--;

                    console.log(
                        `Retry for ${job.studentId}. Remaining: ${retries}`
                    );

                    if (retries === 0)
                        throw err;

                }

            }

            await pushService.pushNotification(
                job.studentId,
                job.message
            );

            success++;

        } catch (err) {

            console.log(
                `Notification Failed for ${job.studentId}`
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

}

/* ---------------------- Stage 6 ---------------------- */

async function fetchTopNotifications(limit = 10) {

    const response = await api.get("/notifications");

    const notifications = response.data.notifications;

    const heap = new MinHeap();

    notifications.forEach(notification => {

        notification.priority =
            calculatePriority(notification);

        if (heap.size() < limit) {

            heap.insert(notification);

        } else {

            const smallest = heap.peek();

            const better =
                notification.priority.weight >
                smallest.priority.weight ||

                (
                    notification.priority.weight ===
                    smallest.priority.weight &&

                    notification.priority.timestamp >
                    smallest.priority.timestamp
                );

            if (better)
                heap.replaceRoot(notification);

        }

    });

    return heap
        .getItems()
        .map(({ priority, ...notification }) => notification);

}

module.exports = {

    notifyAll,

    fetchTopNotifications

};