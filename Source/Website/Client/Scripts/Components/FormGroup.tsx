import * as React from 'react'
//import { FadingLoadingIcon } from 'Components/Icons'

interface IFormGroupProps extends React.Props<any> {
    label?: string | JSX.Element
    htmlFor?: string
    colClass?: string
    className?: string
    loading?: boolean
    optional?: boolean
}

export const FormGroup: React.SFC<IFormGroupProps> = props => {
    const { label, htmlFor, colClass, className, loading, optional } = props

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
        <div className={`form-group ${colClass} ${className ? className : ''}`}>
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
    colClass: 'col-lg-12',
    loading: undefined,
    optional: false
}
