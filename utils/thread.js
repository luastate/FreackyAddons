let Executors = Java.type("java.util.concurrent.Executors");
const Threading = Java.type("gg.essential.api.utils.Multithreading");

export class NonPooledThread {
    #callback;
    #executor;

    /**
     * Creates a new non-pooled thread.
     * 
     * @param {Function} callback - The function to be executed.
     */
    constructor(callback) {
        this.#callback = callback;
        this.#executor = Executors.newSingleThreadExecutor();
    }

    /**
     * Executes the thread.
     */
    execute() {
        this.#executor.execute(this.#callback);
    }

    kill() {
        this.#executor.shutdown();
    }
}

/**
 * Adds a delay before executing a function or runs the function asynchronously.
 *
 * @param {Function} func - The function to be executed after the delay.
 * @param {Number} time - The delay time in milliseconds (optional). If not provided, the function will run asynchronously.
 */
export function delay(func, time) {
    if (time) {
        // Schedule the function to be executed after the specified delay.
        // The time value is converted to milliseconds using java.util.concurrent.TimeUnit.MILLISECONDS.
        Threading.schedule(() => { func() }, time, java.util.concurrent.TimeUnit.MILLISECONDS);
    } else {
        // Run the function asynchronously without any delay.
        Threading.runAsync(() => { func() });
    }
}
