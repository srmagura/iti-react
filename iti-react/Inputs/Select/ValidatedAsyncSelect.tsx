import React,{ useContext } from 'react'
import { ValueType, ActionMeta } from 'react-select/src/types'
import { defaults } from 'lodash'
import AsyncSelect from 'react-select/async'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
    ValidatorOutput
} from '@interface-technologies/iti-react-core'
import { getSelectStyles, GetSelectStylesOptions } from './GetSelectStyles'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../Validation'
import { CommonSelectProps } from './CommonSelectProps'
import { SelectOption } from './SelectOption'

export type AsyncSelectValue = SelectOption | null

interface ValidatedAsyncSelectProps
    extends CommonSelectProps,
        UseValidationProps<AsyncSelectValue> {
    id?: string
    loadOptions: (inputValue: string) => Promise<SelectOption[]>
    noOptionsMessage?: (obj: { inputValue: string }) => string | null
}

export const ValidatedAsyncSelect = React.memo((props: ValidatedAsyncSelectProps) => {
    const {
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

    const { value, onChange: _onChange } = useControlledValue<AsyncSelectValue>({
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
        let newValue: AsyncSelectValue = null
        if (option && option.value !== null) {
            newValue = option
        }

        _onChange(newValue)
    }

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation<
        AsyncSelectValue
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

    const {themeColors} = useContext(ItiReactContext)
    const stylesOptions: GetSelectStylesOptions = {
        valid,
        showValidation,
        themeColors,
        width,
        formControlSize
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
            <AsyncSelect
                name={name}
                className={className}
                inputId={id}
                loadOptions={loadOptions}
                value={value as SelectOption | null}
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
                components={components}
                menuIsOpen={menuIsOpen}
                onMenuOpen={onMenuOpen}
                onMenuClose={onMenuClose}
            />
            {/* ReactSelect does not render the input when isDisabled = true. Render a hidden input with the value,
             * for situations where the select is disabled but it has a default/controlled value. */}
            {!enabled && (
                <input
                    type="hidden"
                    name={name}
                    value={value ? value.value : undefined}
                />
            )}
        </ValidationFeedback>
    )
})

function required(): Validator<AsyncSelectValue> {
    return (value: AsyncSelectValue): ValidatorOutput => ({
        valid: value !== null,
        invalidFeedback: Validators.required()('').invalidFeedback
    })
}

export const AsyncSelectValidators = {
    required
}
