// this doesn't affect the actual compilation, but it will prevent
// some intellisense errors
declare module 'input-format'

declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
