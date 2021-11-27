import React, { useRef, useContext, ReactElement } from 'react'
import { getGuid } from '@interface-technologies/iti-react-core'
import { ItiReactContext } from '../ItiReactContext'

export interface FormGroupProps {
    label?: string | ReactElement
    className?: string
    loading?: boolean
    optional?: boolean

    children?: React.ReactNode | ((id: string) => React.ReactNode)
    'data-testid'?: string
}

/**
 * Renders a form input and corresponding label.
 *
 * The children of this component can either be a JSX element or a function that
 * maps `id` string to a JSX element (better for accessibility).
 */
export function FormGroup({
    label,
    className,
    loading,
    optional = false,
    ...props
}: FormGroupProps): ReactElement {
    const idRef = useRef(getGuid())
    const { renderLoadingIndicator } = useContext(ItiReactContext)

    let labelInner = label
    if (optional) {
        labelInner = (
            <span>
                {label} <span className="optional">(optional)</span>
            </span>
        )
    }

    let children

    if (typeof props.children === 'function') {
        const renderProp = props.children as (id: string) => React.ReactNode
        children = renderProp(idRef.current)
    } else {
        children = props.children
    }

    return (
        <div
            className={`form-group ${className || ''}`}
            data-testid={props['data-testid']}
        >
            {label && (
                <label className="form-label" htmlFor={idRef.current}>
                    {labelInner}{' '}
                    {typeof loading !== 'undefined' &&
                        loading &&
                        renderLoadingIndicator()}
                </label>
            )}
            {children}
        </div>
    )
}
