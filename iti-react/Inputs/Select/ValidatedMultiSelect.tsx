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
import { GroupType, ValueType } from 'react-select/src/types'
import { SelectOption, getNonGroupOptions } from './ValidatedSelect'
import { getSelectStyles, GetSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select/src/components'

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
    getStyles?: GetSelectStyles

    // Any to allow using option types that extend SelectOption, without having
    // to make ValidatedSelect truly generic (annoying to do in React)
    components?: SelectComponentsConfig<any>
}

type ValidatedSelectProps = ValidatedMultiSelectOwnProps &
    WithValidationInjectedProps<MultiSelectValue>

class _ValidatedMultiSelect extends React.PureComponent<ValidatedSelectProps> {
    static defaultProps: Pick<ValidatedSelectProps, 'enabled' | 'getStyles'> = {
        enabled: true,
        getStyles: getSelectStyles
    }

    onChange = (options0: ValueType<SelectOption>) => {
        const { onChange } = this.props

        const options = options0 ? (options0 as SelectOption[]) : []

        const newValue = options.map(o => o.value) as MultiSelectValue
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
            placeholder,
            className,
            formControlSize,
            width,
            enabled,
            components,
            'aria-label': ariaLabel
        } = this.props
        const getStyles = this.props.getStyles!

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
                            styles={getStyles({
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
