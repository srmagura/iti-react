import React, { useRef } from 'react'
import { getGuid } from '@interface-technologies/iti-react-core'

export interface FormCheckProps {
    name?: string
    label: React.ReactNode

    defaultChecked?: boolean
    checked?: boolean
    onChange?(): void

    enabled?: boolean
    readOnly?: boolean
    className?: string
    inline?: boolean
    autoComplete?: 'on' | 'off'
    tabIndex?: number
}

/**
 * An easy to use checkbox component.
 *
 * ```
 * <FormCheck
 *     checked={myBoolean}
 *     onChange={() => setMyBoolean(b => !b)}
 *     label="My checkbox"
 * />
 * ```
 *
 * `inline` is true by default and should be set to false if you want to display
 * a vertical stack of checkboxes.
 */
export const FormCheck = React.memo<FormCheckProps>(
    ({
        name,
        label,
        defaultChecked,
        checked,
        onChange,
        readOnly,
        className,
        autoComplete,
        tabIndex,
        enabled = true,
        inline = true,
    }) => {
        const idRef = useRef(getGuid())

        const classes = ['form-check']
        if (inline) classes.push('form-check-inline')
        if (className) classes.push(className)

        return (
            <div className={classes.join(' ')}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={idRef.current}
                    name={name}
                    defaultChecked={defaultChecked}
                    checked={checked}
                    onChange={onChange}
                    disabled={!enabled}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    tabIndex={tabIndex}
                />
                {/* user-select-none to prevent accidental text selection */}
                <label
                    className="form-check-label user-select-none"
                    htmlFor={idRef.current}
                >
                    {label}
                </label>
            </div>
        )
    }
)
