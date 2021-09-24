import React, { useContext } from 'react'
import Select, { GroupBase, OnChangeValue, ActionMeta } from 'react-select'
import { sortBy } from 'lodash'
import {
    UseValidationProps,
    useControlledValue,
    useValidation,
    Validator,
    Validators,
    ValidatorOutput,
} from '@interface-technologies/iti-react-core'
import { ItiReactContext } from '../../ItiReactContext'
import { ValidationFeedback } from '../../Validation'
import { CommonSelectProps, defaultSelectProps } from './CommonSelectProps'
import { SelectOption, getNonGroupOptions, filterOption } from './SelectOption'

/** The value type for [[`ValidatedMultiSelect`]]. */
export type MultiSelectValue = string[] | number[]

export interface ValidatedMultiSelectProps
    extends CommonSelectProps,
        UseValidationProps<MultiSelectValue> {
    options: SelectOption[] | GroupBase<SelectOption>[]
}

/**
 * A validated dropdown component based on `react-select` that allows selecting
 * multiple options.
 *
 * If any options have isFixed: true, you should sort the options so that fixed options
 * come before unfixed. Sorting the options in the component would cause poor performance
 * when there are many options and the options array is not referentially stable.
 *
 * This component is expensive to render so use `React.memo` when necessary.
 */
export const ValidatedMultiSelect = React.memo(
    ({
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
        enabled = defaultSelectProps.enabled,
        isClearable = defaultSelectProps.isClearable,
        getStyles = defaultSelectProps.getStyles,
        isOptionEnabled,
        menuIsOpen,
        onMenuOpen,
        onMenuClose,
        menuPlacement = defaultSelectProps.menuPlacement,
        ...props
    }: ValidatedMultiSelectProps) => {
        const nonGroupOptions = getNonGroupOptions(options)

        const { value, onChange: _onChange } = useControlledValue<MultiSelectValue>({
            value: props.value,
            onChange: props.onChange,
            defaultValue: props.defaultValue,
            fallbackValue: [],
        })

        function onChange(
            options0: OnChangeValue<SelectOption, boolean>,
            {
                action,
                removedValue,
            }: ActionMeta<SelectOption> & { removedValue?: SelectOption }
        ): void {
            let options: SelectOption[]

            switch (action) {
                case 'clear':
                    options = nonGroupOptions.filter((o) => o.isFixed)
                    break
                case 'remove-value':
                case 'pop-value':
                    if (removedValue && removedValue.isFixed) return
                    options = options0 ? (options0 as SelectOption[]) : []
                    break
                default:
                    options = options0 ? (options0 as SelectOption[]) : []
                    break
            }

            options = sortBy(options, (o) => !o.isFixed)

            const newValue = options.map((o) => o.value) as MultiSelectValue
            _onChange(newValue)
        }

        const validatorOutput = useValidation<MultiSelectValue>({
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

        const optionMap = new Map<string | number, SelectOption>(
            nonGroupOptions.map((o) => [o.value, o])
        )

        // Order of the `value` array determines the order the selected options are displayed in.
        // This way, when a new option is added, it is appended to the selected options instead of
        // potentaily being inserted in the middle
        const selectedOptions = (value as (string | number)[])
            .map((v) => optionMap.get(v))
            .filter((o) => !!o) as SelectOption[]

        let isOptionDisabled
        if (isOptionEnabled)
            isOptionDisabled = (o: SelectOption): boolean => !isOptionEnabled(o)

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
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
                        valid: !validatorOutput,
                        showValidation,
                        themeColors,
                        width,
                        formControlSize,
                        isMulti: true,
                    })}
                    aria-label={props['aria-label']}
                    aria-labelledby={props['aria-labelledby']}
                    // eslint-disable-next-line -- TODO:SAM
                    components={components}
                    isMulti
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

function required(): Validator<MultiSelectValue> {
    return (value: MultiSelectValue): ValidatorOutput => ({
        valid: value.length > 0,
        invalidFeedback: Validators.required()(''),
    })
}

export const MultiSelectValidators = {
    required,
}
