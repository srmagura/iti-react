declare module 'input-format'
declare module 'react-select'
declare module 'react-hint'

declare const NProgress: any

// Omit is like Pick except it omits properties. This is very useful for the props of
// wrapper components when using the React Context API.
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
