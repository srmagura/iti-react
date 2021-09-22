import React, { useState, useEffect } from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'

export interface ClickToCopyProps {
    text: string
    className?: string
}

/**
 * Renders an icon that you can click to copy some text.
 *
 * Relies on FontAwesome and `@tippyjs/react`.
 */
export function ClickToCopy({ text, className }: ClickToCopyProps): React.ReactElement {
    const [copied, setCopied] = useState(false)

    function copy(): void {
        copyToClipboard(text)
        setCopied(true)
    }

    useEffect(() => {
        if (!copied) return undefined

        const timer = window.setTimeout(() => setCopied(false), 2000)
        return (): void => {
            window.clearTimeout(timer)
        }
    }, [copied])

    const tooltip = copied ? 'Copied!' : 'Click to copy'

    const classes = ['click-to-copy']
    if (className) classes.push(className)

    return (
        <Tippy content={tooltip} hideOnClick={false}>
            <div
                className={classes.join(' ')}
                onClick={copy}
                onKeyDown={(e): void => {
                    if (e.key === 'Enter') copy()
                }}
                role="button"
                tabIndex={0}
            >
                <FontAwesomeIcon icon={faCopy} />
            </div>
        </Tippy>
    )
}
