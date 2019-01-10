import * as React from 'react'
import {
    withValidation,
    WithValidationInjectedProps,
    ValidationFeedback,
    Validator,
    Validators,
    ItiReactContext
} from '../..'
import Select from 'react-select'
import { GroupType, ValueType } from 'react-select/lib/types'
import { SelectOption, getNonGroupOptions } from './ValidatedSelect'
import { getSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select/lib/components'

export type MultiSelectValue = string[] | number[]

interface ValidatedMultiSelectOwnProps {
    id?: string
    options: SelectOption[] | GroupType<SelectOption>[]
    isClearable?: boolean
    enabled?: boolean
    placeholder?: string
    className?: string
    formControlSize?: 'sm' | 'lg'
    width?: number
    'aria-label'?: string
    components?: SelectComponentsConfig<SelectOption>
}

type ValidatedSelectProps = ValidatedMultiSelectOwnProps &
    WithValidationInjectedProps<MultiSelectValue>

class _ValidatedMultiSelect extends React.PureComponent<ValidatedSelectProps> {
    static defaultProps: Pick<ValidatedSelectProps, 'enabled'> = {
        enabled: true
    }

    onChange = (options0: ValueType<SelectOption>) => {
        const { onChange } = this.props

        if (options0) {
            const options = options0 as SelectOption[]

            const newValue = options.map(o => o.value) as MultiSelectValue
            onChange(newValue)
        }
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
            placeholder,
            className,
            formControlSize,
            width,
            enabled,
            components,
            'aria-label': ariaLabel
        } = this.props

        const nonGroupOptions = getNonGroupOptions(options)

        const selectedValues = new Set<string | number>(value)
        const selectedOptions = nonGroupOptions.filter(o => selectedValues.has(o.value))

        return (
            <ValidationFeedback
                valid={valid}
                invalidFeedback={invalidFeedback}
                showValidation={showValidation}
            >
                <ItiReactContext.Consumer>
                    {data => (
                        <Select
                            inputId={id}
                            name={name}
                            className={className}
                            options={options}
                            placeholder={placeholder}
                            value={selectedOptions}
                            onChange={this.onChange}
                            isClearable={isClearable}
                            isDisabled={!enabled}
                            styles={getSelectStyles({
                                valid,
                                showValidation,
                                themeColors: data.themeColors,
                                width,
                                formControlSize
                            })}
                            aria-label={ariaLabel}
                            components={components}
                            isMulti
                        />
                    )}
                </ItiReactContext.Consumer>
                <input type="hidden" name={name + 'Json'} value={JSON.stringify(value)} />
            </ValidationFeedback>
        )
    }
}

const defaultValue: MultiSelectValue = []

const options = {
    defaultValue
}

export const ValidatedMultiSelect = withValidation<
    ValidatedMultiSelectOwnProps,
    MultiSelectValue
>(options)(_ValidatedMultiSelect)

function required(): Validator<MultiSelectValue> {
    return (value: MultiSelectValue) => ({
        valid: value.length > 0,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const MultiSelectValidators = {
    required
}
