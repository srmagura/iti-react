import * as React from 'react'
import { useContext } from 'react'
import { ValidationFeedback, Validator, Validators, ItiReactContext } from '../..'
import Select from 'react-select'
import { GroupType, ValueType } from 'react-select/src/types'
import { SelectOption, getNonGroupOptions } from './ValidatedSelect'
import { getSelectStyles, GetSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select/src/components'
import { defaults } from 'lodash'
import { UseValidationProps, useControlledValue, useValidation } from '../../Validation'

export type MultiSelectValue = string[] | number[]

interface ValidatedMultiSelectProps extends UseValidationProps<MultiSelectValue> {
    id?: string
    options: SelectOption[] | GroupType<SelectOption>[]

    isClearable?: boolean
    isLoading?: boolean
    enabled?: boolean
    isOptionEnabled?(option: SelectOption): boolean

    placeholder?: string
    className?: string
    formControlSize?: 'sm' | 'lg'
    width?: number
    getStyles?: GetSelectStyles

    'aria-label'?: string
    'aria-labelledby'?: string

    // Any to allow using option types that extend SelectOption, without having
    // to make ValidatedSelect truly generic (annoying to do in React)
    components?: SelectComponentsConfig<any>
}

export const ValidatedMultiSelect = React.memo((props: ValidatedMultiSelectProps) => {
    const {
        id,
        name,
        options,
        validators,
        showValidation,
        placeholder,
        className,
        formControlSize,
        width,
        components,
        isLoading,
        enabled,
        isClearable,
        getStyles,
        isOptionEnabled
    } = defaults(
        { ...props },
        { enabled: true, getStyles: getSelectStyles, isOptionEnabled: () => true }
    )

    const { value, onChange: _onChange } = useControlledValue<MultiSelectValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: []
    })

    function onChange(options0: ValueType<SelectOption>) {
        const options = options0 ? (options0 as SelectOption[]) : []

        const newValue = options.map(o => o.value) as MultiSelectValue
        _onChange(newValue)
    }

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<
        MultiSelectValue
    >({
        value,
        name: props.name,
        onValidChange: props.onValidChange,
        validators,
        validationKey: props.validationKey,
        asyncValidator: props.asyncValidator,
        onAsyncError: props.onAsyncError,
        onAsyncValidationInProgressChange: props.onAsyncValidationInProgressChange,
        formLevelValidatorOutput: props.formLevelValidatorOutput
    })

    const themeColors = useContext(ItiReactContext).themeColors

    const nonGroupOptions = getNonGroupOptions(options)

    const selectedValues = new Set<string | number>(value)
    const selectedOptions = nonGroupOptions.filter(o => selectedValues.has(o.value))

    return (
        <ValidationFeedback
            valid={valid}
            invalidFeedback={invalidFeedback}
            showValidation={showValidation}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <Select
                inputId={id}
                name={name}
                className={className}
                options={options}
                placeholder={placeholder}
                value={selectedOptions}
                onChange={onChange}
                isClearable={isClearable}
                isDisabled={!enabled}
                isLoading={isLoading}
                isOptionDisabled={option => !isOptionEnabled(option)}
                styles={getStyles({
                    valid,
                    showValidation,
                    themeColors,
                    width,
                    formControlSize
                })}
                aria-label={props['aria-label']}
                aria-labelledby={props['aria-labelledby']}
                components={components}
                isMulti
            />
            <input type="hidden" name={name + 'Json'} value={JSON.stringify(value)} />
        </ValidationFeedback>
    )
})

function required(): Validator<MultiSelectValue> {
    return (value: MultiSelectValue) => ({
        valid: value.length > 0,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const MultiSelectValidators = {
    required
}
