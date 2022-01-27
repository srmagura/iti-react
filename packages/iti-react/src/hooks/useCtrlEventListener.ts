import useEventListener from '@use-it/event-listener'

// Use this to allow the user to submit a form by pressing Ctrl+Enter
// or Command+Enter on Mac
export function useCtrlEnterListener(callback: () => unknown, enabled: boolean): void {
    useEventListener<'keypress'>('keypress', (e) => {
        if (!enabled) return

        if (e.ctrlKey && e.code === 'Enter') {
            callback()
        } else if (e.metaKey && e.code === 'Enter') {
            callback()
        }
    })
}
