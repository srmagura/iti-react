import * as React from 'react'
import { useState, useEffect, useRef } from 'react'

interface SavedMessageProps {
    // This is a weird pattern, but it's the simplest way to keep the timer
    // logic inside the SavedMessage component
    showSavedMessageRef: React.MutableRefObject<() => void>

    className?: string
}

export function SavedMessage(props: SavedMessageProps) {
    const { showSavedMessageRef, className } = props

    const [show, setShow] = useState(false)
    const timerRef = useRef<number>()

    function onSave() {
        setShow(true)

        clearTimeout(timerRef.current)
        timerRef.current = window.window.setTimeout(() => setShow(false), 1800)
    }

    useEffect(() => {
        showSavedMessageRef.current = onSave
    })

    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current)
        }
    }, [])

    const classes = ['saved-message']
    if (className) classes.push(className)

    return (
        <div className={classes.join(' ')} style={{ opacity: show ? 1 : 0 }}>
            <i className="fa fa-check" /> Saved
        </div>
    )
}
