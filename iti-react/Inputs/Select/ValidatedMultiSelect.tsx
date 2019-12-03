import React from 'react'
import { useContext } from 'react'
import { ValidationFeedback, Validator, Validators, ItiReactContext } from '../..'
import Select from 'react-select'
import { GroupType, ValueType, ActionMeta } from 'react-select/src/types'
import { SelectOption, getNonGroupOptions } from './ValidatedSelect'
import { getSelectStyles, GetSelectStyles } from './GetSelectStyles'
import { SelectComponentsConfig } from 'react-select/src/components'
import { defaults, sortBy } from 'lodash'
import { UseValidationProps, useControlledValue, useValidation } from '../../Validation'

// If any options have isFixed: true, you should sort the options so that fixed options
// come before unfixed. Sorting the options in the component would cause poor performance
// when there are many options and the options array is not referentially stable.

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

    menuIsOpen?: boolean
    onMenuOpen?(): void
    onMenuClose?(): void
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
        isOptionEnabled,
        menuIsOpen,
        onMenuOpen,
        onMenuClose
    } = defaults({ ...props }, { enabled: true, getStyles: getSelectStyles })

    const nonGroupOptions = getNonGroupOptions(options)

    const { value, onChange: _onChange } = useControlledValue<MultiSelectValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: []
    })

    function onChange(
        options0: ValueType<SelectOption>,
        { action, removedValue }: ActionMeta & { removedValue?: SelectOption }
    ) {
        let options: SelectOption[]

        switch (action) {
            case 'clear':
                options = nonGroupOptions.filter(o => o.isFixed)
                break
            case 'remove-value':
            case 'pop-value':
                if (removedValue && removedValue.isFixed) return
            default:
                options = options0 ? (options0 as SelectOption[]) : []
                break
        }

        options = sortBy(options, o => !o.isFixed)

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

    const optionMap = new Map<string | number, SelectOption>(
        nonGroupOptions.map(o => [o.value, o])
    )

    // Order of the `value` array determines the order the selected options are displayed in.
    // This way, when a new option is added, it is appended to the selected options instead of
    // potentaily being inserted in the middle
    const selectedOptions = (value as (string | number)[])
        .map(v => optionMap.get(v))
        .filter(o => !!o) as SelectOption[]

    let isOptionDisabled
    if (isOptionEnabled) isOptionDisabled = (o: SelectOption) => !isOptionEnabled(o)

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
                isOptionDisabled={isOptionDisabled}
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
                menuIsOpen={menuIsOpen}
                onMenuOpen={onMenuOpen}
                onMenuClose={onMenuClose}
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
