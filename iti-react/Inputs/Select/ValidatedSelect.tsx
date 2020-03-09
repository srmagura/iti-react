import React from 'react'
import { useContext } from 'react'
import { ValidationFeedback } from '../../Validation'
import { ItiReactContext } from '../../ItiReactContext'
import Select from 'react-select'
import { ValueType, ActionMeta, GroupType } from 'react-select/src/types'
import { partition, flatten, defaults } from 'lodash'
import { getSelectStyles } from './GetSelectStyles'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
    nullToUndefined,
    ValidatorOutput
} from '@interface-technologies/iti-react-core'
import { CommonSelectProps } from './CommonSelectProps'

export function getNonGroupOptions(
    options: (SelectOption | GroupType<SelectOption>)[]
): SelectOption[] {
    const [groupOptions, nonGroupOptions] = partition(
        options,
        o => typeof o.value === 'undefined'
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
    isDisabled?: boolean
    isFixed?: boolean // only applies to multiselect
}

interface ValidatedSelectProps
    extends CommonSelectProps,
        UseValidationProps<SelectValue> {
    id?: string
    options: SelectOption[] | GroupType<SelectOption>[]
}

export const ValidatedSelect = React.memo((props: ValidatedSelectProps) => {
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
    } = defaults(
        { ...props },
        {
            enabled: true,
            isClearable: false,
            getStyles: getSelectStyles
        }
    )

    const { value, onChange: _onChange } = useControlledValue<SelectValue>({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: null
    })

    function onChange(option0: ValueType<SelectOption>, actionMeta: ActionMeta): void {
        // option will be an array if the user presses backspace

        // This is so that if isClearable = false, null will never be passed to the
        // onChange prop
        if (!isClearable && actionMeta.action === 'pop-value') return

        const option = option0 as SelectOption

        // Be careful with the conditional - option.value could be 0
        let newValue: SelectValue = null
        if (option && option.value !== null) {
            newValue = option.value
        }

        _onChange(newValue)
    }

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<
        SelectValue
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

    let selectValue: SelectOption | null = null

    // Be careful: value can be 0
    if (value !== null) {
        const findResult = nonGroupOptions.find(o => o.value === value)
        if (findResult) selectValue = findResult
    }

    let isOptionDisabled
    if (isOptionEnabled)
        isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

    return (
        <ValidationFeedback
            valid={valid}
            invalidFeedback={invalidFeedback}
            showValidation={showValidation}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <Select
                name={name}
                className={className}
                inputId={id}
                options={options}
                placeholder={placeholder}
                value={selectValue}
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
                menuIsOpen={menuIsOpen}
                onMenuOpen={onMenuOpen}
                onMenuClose={onMenuClose}
            />
            {/* ReactSelect does not render the input when isDisabled = true. Render a hidden input with the value,
             * for situations where the select is disabled but it has a default/controlled value. */}
            {!enabled && (
                <input type="hidden" name={name} value={nullToUndefined(value)} />
            )}
        </ValidationFeedback>
    )
})

function required(): Validator<SelectValue> {
    return (value: SelectValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const SelectValidators = {
    required
}
