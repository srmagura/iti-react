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
import {
    SelectOption,
    SelectGroupOption,
    getSelectStyles,
    getNonGroupOptions
} from './ValidatedSelect'

export type MultiSelectValue = string[] | number[]

interface ValidatedMultiSelectOwnProps {
    id?: string
    options: (SelectOption | SelectGroupOption)[]
    isClearable?: boolean
    enabled?: boolean
    placeholder?: string
    className?: string
    width?: number
}

type ValidatedSelectProps = ValidatedMultiSelectOwnProps &
    WithValidationInjectedProps<MultiSelectValue>

class _ValidatedMultiSelect extends React.PureComponent<ValidatedSelectProps> {
    static defaultProps: Pick<ValidatedSelectProps, 'enabled'> = {
        enabled: true
    }

    onChange = (options: SelectOption[] | null | undefined) => {
        const { onChange } = this.props

        if (options) {
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
            width,
            enabled
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
                            styles={getSelectStyles(
                                valid,
                                showValidation,
                                data.themeColors,
                                width
                            )}
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
