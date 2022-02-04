import { defer } from 'lodash'
import useEventListener from '@use-it/event-listener'
import { useEffect, useState } from 'react'

/** @internal */
export function hasAncestor(target: HTMLElement, selector: string): boolean {
    const parent = target.parentElement
    if (!parent) return false

    if (parent.matches(selector)) return true

    return hasAncestor(parent, selector)
}

export interface UsePopoverClickListenerOptions {
    visible: boolean
    onOutsideClick: () => void
    popoverSelector?: string
}

/**
 * A hook that detects when the user has clicked outside of a popover,
 * indicating that the popover should be closed.
 */
export function usePopoverClickListener({
    visible,
    onOutsideClick,
    popoverSelector = '.popover-with-click-listener',
}: UsePopoverClickListenerOptions): void {
    const [visibleSince, setVisibleSince] = useState<Date>()

    useEffect(() => {
        setVisibleSince(visible ? new Date() : undefined)
    }, [visible])

    function onClick(e: MouseEvent): void {
        if (!visible) return
        if (!e.target) return

        // The next 3 lines prevent onOutsideClick from firing due to the click
        // event that showed the popover
        if (!visibleSince) return

        const msSinceShown = new Date().valueOf() - visibleSince.valueOf()
        if (msSinceShown < 50) return

        const target = e.target as HTMLElement

        // Hack to prevent clicking a react select option from closing the popover
        if (hasAncestor(target, '[class$="-menu"]')) return

        const inPopover =
            target.matches(popoverSelector) || hasAncestor(target, popoverSelector)

        if (!inPopover) {
            // To understand why we use defer here, consider what would happen if we
            // did NOT user defer. When the reference element is clicked, onOutsideClick
            // would be called immediately and the popover would be hidden. Then the
            // onClick handler of the reference element would fire, immediately showing
            // the popover again.

            // We used to prevent this using e.stopPropagation(), but stopping
            // propagation causes LinkButton act like a link to # instead of
            // a button.
            defer(onOutsideClick)
        }
    }

    useEventListener('click', onClick)
}
