import React, { useState, useEffect } from 'react'

// Source: https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
/* eslint-disable */
export function copyToClipboard(str: string) {
    const el = document.createElement('textarea') // Create a <textarea> element
    el.value = str // Set its value to the string that you want copied
    el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
    el.style.position = 'absolute'
    el.style.left = '-9999px' // Move outside the screen to make it invisible
    document.body.appendChild(el) // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection()!.rangeCount > 0 // Check if there is any content selected previously
            ? document.getSelection()!.getRangeAt(0) // Store selection if found
            : false // Mark as false to know no selection existed before
    el.select() // Select the <textarea> content
    document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el) // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        document.getSelection()!.removeAllRanges() // Unselect everything on the HTML document
        document.getSelection()!.addRange(selected) // Restore the original selection
    }
}
/* eslint-enable */

interface ClickToCopyProps {
    text: string
    className?: string

    forceUpdateTooltips(): void
}

export function ClickToCopy(props: ClickToCopyProps): React.ReactElement {
    const { text, className, forceUpdateTooltips } = props

    const [copied, setCopied] = useState(false)

    function copy(): void {
        copyToClipboard(text)
        setCopied(true)
    }

    useEffect(() => {
        if (!copied) return undefined

        forceUpdateTooltips()

        const timer = window.setTimeout(() => setCopied(false), 100)
        return (): void => {
            window.clearTimeout(timer)
        }
    }, [copied, forceUpdateTooltips])

    const tooltip = copied ? 'Copied!' : 'Click to copy'

    const classes = ['click-to-copy']
    if (className) classes.push(className)

    // this component depends on your app having a tooltip library (e.g. react-hint)
    // that looks for a data - tooltip attribute
    return (
        <div
            className={classes.join(' ')}
            data-tooltip={tooltip}
            onClick={copy}
            onKeyDown={(e): void => {
                if (e.key === 'Enter') copy()
            }}
            role="button"
            tabIndex={0}
        >
            <i className="fa fa-copy" />
        </div>
    )
}
