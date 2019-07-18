import * as React from 'react'
import {
    withValidation,
    WithValidationInjectedProps,
    ValidationFeedback,
    Validator,
    Validators,
    ItiReactContext,
    nullToUndefined
} from '../..'
import Select from 'react-select'
import { ValueType, ActionMeta, GroupType } from 'react-select/lib/types'
import { partition, flatten } from 'lodash'
import { getSelectStyles, GetSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select/lib/components'

export function getNonGroupOptions(
    options: (SelectOption | GroupType<SelectOption>)[]
): SelectOption[] {
    let [groupOptions, nonGroupOptions] = partition(
        options,
        o => typeof (o as any).value === 'undefined'
    ) as [GroupType<SelectOption>[], SelectOption[]]

    return [
        ...nonGroupOptions,
        ...flatten<SelectOption>(groupOptions.map(go => go.options))
    ]
}

export type SelectValue = string | number | null

export interface SelectOption {
    value: string | number
    label: string
}

interface ValidatedSelectOwnProps {
    id?: string
    options: SelectOption[] | GroupType<SelectOption>[]
    isClearable?: boolean
    enabled?: boolean
    placeholder?: string
    className?: string
    formControlSize?: 'sm' | 'lg'
    width?: number
    'aria-label'?: string
    getStyles?: GetSelectStyles

    // Any to allow using option types that extend SelectOption, without having
    // to make ValidatedSelect truly generic (annoying to do in React)
    components?: SelectComponentsConfig<any>
}

type ValidatedSelectProps = ValidatedSelectOwnProps &
    WithValidationInjectedProps<SelectValue>

class _ValidatedSelect extends React.PureComponent<ValidatedSelectProps> {
    static defaultProps: Pick<
        ValidatedSelectProps,
        'enabled' | 'isClearable' | 'getStyles'
    > = {
        enabled: true,
        isClearable: false,
        getStyles: getSelectStyles
    }

    onChange = (option0: ValueType<SelectOption>, actionMeta: ActionMeta) => {
        // option will be an array if the user presses backspace

        const { onChange, isClearable } = this.props

        // This is so that if isClearable = false, you don't have to worry about ValidatedSelect's
        // onChange returning null. pop-value doesn't happen often so this will hopefully avoid
        // some bugs.
        if (!isClearable && actionMeta.action === 'pop-value') return

        const option = option0 as SelectOption

        // Be careful with the conditional - option.value could be 0
        let newValue: SelectValue = null
        if (option && option.value !== null) {
            newValue = option.value
        }

        onChange(newValue)
    }

    render() {
        const {
            id,
            options,
            value,
            valid,
            invalidFeedback,
            showValidation,
            name,
            isClearable,
            enabled,
            placeholder,
            className,
            width,
            formControlSize,
            components,
            'aria-label': ariaLabel
        } = this.props
        const getStyles = this.props.getStyles!

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: SelectOption | null = null

        // Be careful in conditional - value can be 0
        if (value !== null) {
            selectValue = nonGroupOptions.find(o => o.value === value)!
        }

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation}
            >
                <ItiReactContext.Consumer>
                    {data => (
                        <Select
                            name={name}
                            className={className}
                            inputId={id}
                            options={options}
                            placeholder={placeholder}
                            value={selectValue}
                            onChange={this.onChange}
                            isClearable={isClearable}
                            isDisabled={!enabled}
                            styles={getStyles({
                                valid,
                                showValidation,
                                themeColors: data.themeColors,
                                width,
                                formControlSize
                            })}
                            aria-label={ariaLabel}
                            components={components}
                        />
                    )}
                </ItiReactContext.Consumer>
                {/* ReactSelect does not render the input when isDisabled = true. Render a hidden input with the value,
                 * for situations where the select is disabled but it has a default/controlled value. */}
                {!enabled && (
                    <input type="hidden" name={name} value={nullToUndefined(value)} />
                )}
            </ValidationFeedback>
        )
    }
}

const options = {
    defaultValue: null
}

export const ValidatedSelect = withValidation<ValidatedSelectOwnProps, SelectValue>(
    options
)(_ValidatedSelect)

function required(): Validator<SelectValue> {
    return (value: SelectValue) => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const SelectValidators = {
    required
}
