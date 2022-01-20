import React, { useContext } from 'react'
import Select, { OnChangeValue, ActionMeta, GroupBase } from 'react-select'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
} from '@interface-technologies/iti-react-core'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../validation'
import { CommonSelectProps, defaultSelectProps } from './CommonSelectProps'
import { SelectOption, getNonGroupOptions, filterOption } from './SelectOption'

/** The value type for [[`ValidatedSelect`]]. */
export type SelectValue = string | number | null

export interface ValidatedSelectProps
    extends CommonSelectProps,
        UseValidationProps<SelectValue> {
    id?: string
    options: SelectOption[] | GroupBase<SelectOption>[]
}

/**
 * A validated dropdown component based on `react-select`.
 *
 * This component is expensive to render so use `React.memo` when necessary.
 */
export const ValidatedSelect = React.memo(
    ({
        id,
        name,
        options,
        validators,
        showValidation,
        placeholder,
        className,
        inputClassName,
        formControlSize,
        width,
        components,
        isLoading,
        enabled = defaultSelectProps.enabled,
        isClearable = defaultSelectProps.isClearable,
        getStyles = defaultSelectProps.getStyles,
        isOptionEnabled,
        menuIsOpen,
        onMenuOpen,
        onMenuClose,
        menuPlacement = defaultSelectProps.menuPlacement,
        ...props
    }: ValidatedSelectProps) => {
        const { value, onChange: _onChange } = useControlledValue<SelectValue>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: null,
        })

        function onChange(
            option0: OnChangeValue<SelectOption, boolean>,
            actionMeta: ActionMeta<SelectOption>
        ): void {
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

        const validatorOutput = useValidation<SelectValue>({
            value,
            name,
            onValidChange: props.onValidChange,
            validators,
            validationKey: props.validationKey,
            asyncValidator: props.asyncValidator,
            onAsyncError: props.onAsyncError,
            formLevelValidatorOutput: props.formLevelValidatorOutput,
        })

        const { themeColors } = useContext(ItiReactContext)

        const nonGroupOptions = getNonGroupOptions(options)

        let selectValue: SelectOption | null = null

        // Be careful: value can be 0
        if (value !== null) {
            const findResult = nonGroupOptions.find((o) => o.value === value)
            if (findResult) selectValue = findResult
        }

        let isOptionDisabled
        if (isOptionEnabled)
            isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
                className={className}
            >
                <Select
                    name={name}
                    className={inputClassName}
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
                        valid: !validatorOutput,
                        showValidation,
                        themeColors,
                        width,
                        formControlSize,
                        isMulti: false,
                    })}
                    aria-label={props['aria-label']}
                    aria-labelledby={props['aria-labelledby']}
                    // eslint-disable-next-line -- TODO:SAM
                    components={components}
                    menuIsOpen={menuIsOpen}
                    onMenuOpen={onMenuOpen}
                    onMenuClose={onMenuClose}
                    menuPlacement={menuPlacement}
                    filterOption={filterOption}
                />
            </ValidationFeedback>
        )
    }
)

function required(): Validator<SelectValue> {
    return (value) => {
        if (value === null) return Validators.required()('')

        return undefined
    }
}

export const SelectValidators = {
    required,
}
