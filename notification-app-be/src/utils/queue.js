class Queue {

    constructor() {
        this.jobs = [];
    }

    add(job) {
        this.jobs.push(job);
    }

    async process(worker) {

        while (this.jobs.length > 0) {

            const job = this.jobs.shift();

            await worker(job);

        }

    }

}

module.exports = Queue;