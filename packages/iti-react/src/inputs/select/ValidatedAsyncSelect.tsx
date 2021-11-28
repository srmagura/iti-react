import React, { useContext, useEffect, useRef } from 'react'
import { OnChangeValue, ActionMeta, GroupBase } from 'react-select'
import AsyncSelect from 'react-select/async'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
} from '@interface-technologies/iti-react-core'
import debounce from 'debounce-promise'
import { GetSelectStylesOptions } from './getSelectStyles'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../validation'
import { CommonSelectProps, defaultSelectProps } from './CommonSelectProps'
import { SelectOption, filterOption } from './SelectOption'

/** The value type for [[`ValidatedAsyncSelect`]]. */
export type AsyncSelectValue = SelectOption | null

export interface ValidatedAsyncSelectProps
    extends CommonSelectProps,
        UseValidationProps<AsyncSelectValue> {
    loadOptions: (
        inputValue: string
    ) => Promise<SelectOption[] | GroupBase<SelectOption>[]>

    noOptionsMessage?: (obj: { inputValue: string }) => string | null
}

/**
 * A validated dropdown component based on `react-select` that loads its
 * options via an API call.
 *
 * This component is expensive to render so use `React.memo` when necessary.
 */
export const ValidatedAsyncSelect = React.memo<ValidatedAsyncSelectProps>(
    ({
        id,
        name,
        validators,
        showValidation,
        loadOptions,
        placeholder,
        noOptionsMessage,
        className,
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
    }) => {
        const { value, onChange: _onChange } = useControlledValue<AsyncSelectValue>({
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
            let newValue: AsyncSelectValue = null
            if (option && option.value !== null) {
                newValue = option
            }

            _onChange(newValue)
        }

        const validatorOutput = useValidation<AsyncSelectValue>({
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
        const stylesOptions: GetSelectStylesOptions = {
            valid: !validatorOutput,
            showValidation,
            themeColors,
            width,
            formControlSize,
            isMulti: false,
        }

        let isOptionDisabled
        if (isOptionEnabled)
            isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

        const loadOptionsRef = useRef(loadOptions)
        useEffect(() => {
            loadOptionsRef.current = loadOptions
        })

        const loadOptionsDebouncedRef = useRef(
            debounce((inputValue: string) => loadOptionsRef.current(inputValue), 500)
        )

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
            >
                <AsyncSelect
                    name={name}
                    className={className}
                    inputId={id}
                    loadOptions={loadOptionsDebouncedRef.current}
                    value={value}
                    noOptionsMessage={noOptionsMessage}
                    placeholder={placeholder}
                    onChange={onChange}
                    isClearable={isClearable}
                    isDisabled={!enabled}
                    isLoading={isLoading}
                    isOptionDisabled={isOptionDisabled}
                    styles={getStyles(stylesOptions)}
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

function required(): Validator<AsyncSelectValue> {
    return (value) => {
        if (value === null) return Validators.required()('')

        return undefined
    }
}

export const AsyncSelectValidators = {
    required,
}
