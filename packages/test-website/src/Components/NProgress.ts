// Load NProgress after the initial page load as an optimization
export function loadNProgress(): void {
    const script = document.createElement('script')
    script.src = '/nprogress/nprogress.min.js'
    document.body.append(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/nprogress/nprogress.min.css'
    document.body.append(link)
}

const _window = window as unknown as {
    NProgress?: {
        start(): void
        done(): void
    }
}

export const NProgress = {
    start: (): void => _window.NProgress?.start(),
    done: (): void => _window.NProgress?.done(),
}
