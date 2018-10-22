﻿import * as React from 'react'
//import { FadingLoadingIcon } from 'Components/Icons'

interface FormGroupProps extends React.Props<any> {
    label?: string | JSX.Element
    htmlFor?: string
    className?: string
    loading?: boolean
    optional?: boolean
}

export const FormGroup: React.SFC<FormGroupProps> = props => {
    const { label, htmlFor, className, loading, optional } = props

    let labelInner = label
    if (optional) {
        labelInner = (
            <span>
                {label + ' '}
                <span className="optional">(optional)</span>
            </span>
        )
    }

    // FadingLoadingIcon fade in does not work in modal. Need to mount that element after shown.bs.modal
    // event fires for it to work.
    return (
        <div className={`form-group ${className ? className : ''}`}>
            {label && (
                <label className="form-control-label" htmlFor={htmlFor}>
                    {labelInner}{' '}
                    {/*typeof (loading) !== 'undefined' && <FadingLoadingIcon loading={loading} />*/}
                </label>
            )}
            {props.children}
        </div>
    )
}

FormGroup.defaultProps = {
    loading: undefined,
    optional: false
}
