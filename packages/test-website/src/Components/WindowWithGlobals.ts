interface NProgress {
    start(): void
    done(): void
}

export interface WindowWithGlobals {
    NProgress?: NProgress
}
