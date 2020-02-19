import React from 'react'
import { getGuid } from '@interface-technologies/iti-react-core'

interface FormCheckProps {
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

export class FormCheck extends React.PureComponent<FormCheckProps> {
    static defaultProps: Pick<FormCheckProps, 'enabled' | 'inline'> = {
        enabled: true,
        inline: true
    }

    readonly id = getGuid()

    render() {
        const {
            name,
            label,
            defaultChecked,
            checked,
            onChange,
            readOnly,
            className,
            autoComplete,
            tabIndex
        } = this.props
        const enabled = this.props.enabled!
        const inline = this.props.inline!

        const classes = ['form-check']
        if (inline) classes.push('form-check-inline')
        if (className) classes.push(className)

        return (
            <div className={classes.join(' ')}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={this.id}
                    name={name}
                    defaultChecked={defaultChecked}
                    checked={checked}
                    onChange={onChange}
                    disabled={!enabled}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    tabIndex={tabIndex}
                />
                {/* user-select-none: prevent accidental text selection */}
                <label className="form-check-label user-select-none" htmlFor={this.id}>
                    {label}
                </label>
            </div>
        )
    }
}
