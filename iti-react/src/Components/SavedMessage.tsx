import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, useRef } from 'react'

export interface SavedMessageProps {
    showSavedMessageRef: React.MutableRefObject<() => void>

    className?: string
}

/**
 * Shows a "✔ Saved" message next to your "Save changes" button to show that
 * user that the change went through. The message fades in and out.
 *
 * ```
 * const showSavedMessageRef = useRef(() => {})
 *
 * function saveChanges() {
 *     // call the API
 *
 *     showSavedMessageRef.current()
 * }
 *
 * return <div>
 *     ...
 *      <SavedMessage
 *          showSavedMessageRef={showSavedMessageRef}
 *          className="saved-message-me"
 *      />
 *     ...
 * </div>
 * ```
 */
export function SavedMessage({
    showSavedMessageRef,
    className,
}: SavedMessageProps): React.ReactElement {
    const [show, setShow] = useState(false)
    const timerRef = useRef<number>()

    function onSave(): void {
        setShow(true)

        clearTimeout(timerRef.current)
        timerRef.current = window.window.setTimeout(() => setShow(false), 1800)
    }

    useEffect(() => {
        showSavedMessageRef.current = onSave
    })

    useEffect(
        () => (): void => {
            clearTimeout(timerRef.current)
        },
        []
    )

    const classes = ['saved-message']
    if (className) classes.push(className)

    return (
        <div className={classes.join(' ')} style={{ opacity: show ? 1 : 0 }}>
            <FontAwesomeIcon icon={faCheck} /> Saved
        </div>
    )
}
