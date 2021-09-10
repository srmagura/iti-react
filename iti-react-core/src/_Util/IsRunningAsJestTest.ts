// eslint-disable-next-line
declare const process: any

/**
 * Used to run different code if running in a Jest test.
 */
export function isRunningAsJestTest(): boolean {
    // Necessary to prevent ReferenceError
    if (typeof process === 'undefined') return false

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return typeof process?.env?.JEST_WORKER_ID !== 'undefined'
}
