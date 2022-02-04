import React, { useState, PropsWithChildren, ReactElement } from 'react'
import { usePopper } from 'react-popper'
import useEventListener from '@use-it/event-listener'
import ReactDOM from 'react-dom'
import { usePopoverClickListener } from '../hooks'

/** The props type of [[`EasyFormPopoverWrapper`]]. */
export interface EasyFormPopoverManagerProps {
    renderReferenceElement(args: {
        setRef(element: HTMLElement | null): void
        onClick(): void
    }): ReactElement

    popoverVisible: boolean
    onPopoverVisibleChange(popoverVisible: boolean): void
}

/**
 * Like [[`EasyFormDialog`]], but a popover. For small forms.
 *
 * There must be an empty `div` in the document with ID `easyFormPopoverPortalDestination`.
 */
export function EasyFormPopoverManager({
    renderReferenceElement,
    children,
    popoverVisible,
    onPopoverVisibleChange,
}: PropsWithChildren<EasyFormPopoverManagerProps>): React.ReactElement {
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 9],
                },
            },
            { name: 'arrow', options: { element: arrowElement } },
        ],
    })

    // Close popover on Escape
    useEventListener<'keydown'>('keydown', (e) => {
        if (popoverVisible && e.code === 'Escape') {
            onPopoverVisibleChange(false)
        }
    })

    usePopoverClickListener({
        visible: popoverVisible,
        onOutsideClick: () => onPopoverVisibleChange(false),
    })

    const [portalDestination] = useState(() =>
        document.getElementById('easyFormPopoverPortalDestination')
    )
    if (!portalDestination)
        throw new Error('Could not find easyFormPopoverPortalDestination.')

    return (
        <>
            {renderReferenceElement({
                setRef: setReferenceElement,
                onClick: () => onPopoverVisibleChange(true),
            })}
            {popoverVisible &&
                ReactDOM.createPortal(
                    <div
                        ref={setPopperElement}
                        className="iti-popover form-popover popover-with-click-listener"
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        {children}
                        <div
                            ref={setArrowElement}
                            style={styles.arrow}
                            className="iti-popover-arrow"
                        />
                    </div>,
                    portalDestination
                )}
        </>
    )
}
