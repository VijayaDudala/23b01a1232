class MinHeap {

    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    parent(i) {
        return Math.floor((i - 1) / 2);
    }

    left(i) {
        return 2 * i + 1;
    }

    right(i) {
        return 2 * i + 2;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] =
            [this.heap[j], this.heap[i]];
    }

    compare(a, b) {

        if (a.priority.weight !== b.priority.weight)
            return a.priority.weight - b.priority.weight;

        return a.priority.timestamp - b.priority.timestamp;

    }

    insert(item) {

        this.heap.push(item);

        this.heapifyUp();

    }

    heapifyUp() {

        let index = this.heap.length - 1;

        while (
            index > 0 &&
            this.compare(
                this.heap[index],
                this.heap[this.parent(index)]
            ) < 0
        ) {

            this.swap(index, this.parent(index));

            index = this.parent(index);

        }

    }

    heapifyDown(index = 0) {

        let smallest = index;

        const left = this.left(index);
        const right = this.right(index);

        if (
            left < this.size() &&
            this.compare(
                this.heap[left],
                this.heap[smallest]
            ) < 0
        ) {
            smallest = left;
        }

        if (
            right < this.size() &&
            this.compare(
                this.heap[right],
                this.heap[smallest]
            ) < 0
        ) {
            smallest = right;
        }

        if (smallest !== index) {

            this.swap(index, smallest);

            this.heapifyDown(smallest);

        }

    }

    peek() {
        return this.heap[0];
    }

    replaceRoot(item) {

        this.heap[0] = item;

        this.heapifyDown();

    }

    getItems() {

        return this.heap.sort((a, b) => {

            if (b.priority.weight !== a.priority.weight)
                return b.priority.weight - a.priority.weight;

            return b.priority.timestamp - a.priority.timestamp;

        });

    }

}

module.exports = MinHeap;