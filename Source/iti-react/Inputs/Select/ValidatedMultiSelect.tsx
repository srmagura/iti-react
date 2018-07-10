import * as React from 'react'
import {
    withValidation,
    IWithValidationInjectedProps,
    ValidationFeedback,
    Validator,
    Validators,
    ITIReactContext
} from '../..'
import Select from 'react-select'
import { partition, flatten } from 'lodash'
import * as Color from 'color'
import {
    IOption,
    IGroupOption,
    getSelectStyles,
    getNonGroupOptions
} from './ValidatedSelect'

export type MultiSelectValue = string[] | number[]

interface IValidatedMultiSelectOwnProps extends React.Props<any> {
    options: (IOption | IGroupOption)[]
    isClearable?: boolean
    placeholder?: string
    className?: string
}

type IValidatedSelectProps = IValidatedMultiSelectOwnProps &
    IWithValidationInjectedProps<MultiSelectValue>

class _ValidatedMultiSelect extends React.Component<IValidatedSelectProps> {
    onChange = (options: IOption[] | null | undefined) => {
        const { onChange } = this.props

        if (options) {
            const newValue = options.map(o => o.value) as MultiSelectValue
            onChange(newValue)
        }
    }

    render() {
        const {
            options,
            value,
            valid,
            invalidFeedback,
            showValidation,
            name,
            isClearable,
            placeholder,
            className
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
                <ITIReactContext.Consumer>
                    {data => (
                        <Select
                            name={name}
                            className={className}
                            options={options}
                            placeholder={placeholder}
                            value={selectedOptions}
                            onChange={this.onChange}
                            isClearable={isClearable}
                            styles={getSelectStyles(
                                valid,
                                showValidation,
                                data.themeColors
                            )}
                            isMulti
                        />
                    )}
                </ITIReactContext.Consumer>
            </ValidationFeedback>
        )
    }
}

const defaultValue: MultiSelectValue = []

const options = {
    defaultValue
}

export const ValidatedMultiSelect = withValidation<
    IValidatedMultiSelectOwnProps,
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
