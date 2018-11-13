import * as React from 'react'
import { getRandomId } from '@interface-technologies/iti-react'
//import { FadingLoadingIcon } from 'Components/Icons'

interface FormGroupProps {
    label?: string | JSX.Element
    className?: string
    loading?: boolean
    optional?: boolean

    key?: string | number
    children?: React.ReactNode | ((id: string) => React.ReactNode)
}

export class FormGroup extends React.PureComponent<FormGroupProps> {
    static defaultProps: Pick<FormGroupProps, 'loading' | 'optional'> = {
        loading: undefined,
        optional: false
    }

    readonly id = getRandomId()

    render() {
        const { label, className, loading, optional } = this.props

        let labelInner = label
        if (optional) {
            labelInner = (
                <span>
                    {label + ' '}
                    <span className="optional">(optional)</span>
                </span>
            )
        }

        let children

        if (typeof this.props.children === 'function') {
            const renderProp = this.props.children as (id: string) => React.ReactNode
            children = renderProp(this.id)
        } else {
            children = this.props.children
        }

        // FadingLoadingIcon fade in does not work in modal. Need to mount that element after shown.bs.modal
        // event fires for it to work.
        return (
            <div className={`form-group ${className ? className : ''}`}>
                {label && (
                    <label className="form-control-label" htmlFor={this.id}>
                        {labelInner}{' '}
                        {/*typeof (loading) !== 'undefined' && <FadingLoadingIcon loading={loading} />*/}
                    </label>
                )}
                {children}
            </div>
        )
    }
}
