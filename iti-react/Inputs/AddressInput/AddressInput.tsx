import * as React from 'react'
import { useCallback, useContext, useMemo } from 'react'
import {
    Validator,
    ItiReactContext,
    UseValidationProps,
    ValidationFeedback,
    ValidatedInput,
    getStateOptions,
    Validators,
    useValidation,
    useControlledValue
} from '@interface-technologies/iti-react'
import {
    GetSelectStyles,
    ValidatedSelect,
    SelectValue,
    SelectValidators
} from '../Select'
import { postalCodeValidator } from './PostalCodeValidator'
import {
    allFieldsValid,
    allFieldsLengthValidator,
    disallowPartialAddress
} from './AddressValidators'

export type AddressInputValue = {
    line1: string
    line2: string
    city: string
    state: string
    postalCode: string
}

export const defaultAddressInputValue: AddressInputValue = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: ''
}

export type AddressInputFieldLengths = {
    line1: number
    line2: number
    city: number
}

interface AddressInputProps extends UseValidationProps<AddressInputValue> {
    individualInputsRequired: boolean
    enabled?: boolean

    getStateSelectStyles?: GetSelectStyles
    allowCanadian?: boolean
}

export function AddressInput(props: AddressInputProps) {
    const { showValidation, getStateSelectStyles, individualInputsRequired } = props
    const enabled = props.enabled!

    function getContextData() {
        const context = useContext(ItiReactContext)

        const fieldLengths = context.fieldLengths.address

        let allowCanadian = props.allowCanadian
        if (typeof allowCanadian === 'undefined')
            allowCanadian = context.addressInput.allowCanadian

        return { fieldLengths, allowCanadian }
    }

    function getValidators(): Validator<AddressInputValue>[] {
        const validators = [
            allFieldsValid({ allowCanadian }),
            allFieldsLengthValidator(fieldLengths),
            ...props.validators
        ]

        if (!individualInputsRequired) {
            // this validator is only needed for optional addresses
            validators.push(disallowPartialAddress())
        }

        return validators
    }

    function getFieldValidators() {
        const baseFieldValidators = []
        const stateValidators: Validator<SelectValue>[] = []

        if (individualInputsRequired) {
            baseFieldValidators.push(Validators.required())
            stateValidators.push(SelectValidators.required())
        }

        return {
            line1: [...baseFieldValidators, Validators.maxLength(fieldLengths.line1)],
            line2: [Validators.maxLength(fieldLengths.line2)],
            city: [...baseFieldValidators, Validators.maxLength(fieldLengths.city)],
            state: stateValidators,
            postalCode: [...baseFieldValidators, postalCodeValidator({ allowCanadian })]
        }
    }

    const { allowCanadian, fieldLengths } = getContextData()
    const validators = getValidators()
    const fieldValidators = getFieldValidators()

    const { value, onChange } = useControlledValue({
        value: props.value,
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        fallbackValue: defaultAddressInputValue
    })

    const { valid, invalidFeedback, asyncValidationInProgress } = useValidation({
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

    const stateOptions = useMemo(
        () =>
            getStateOptions({
                includeUsStates: true,
                includeCanadianProvinces: allowCanadian
            }),
        [getStateOptions, allowCanadian]
    )

    const vProps = {
        showValidation,
        validationKey: individualInputsRequired.toString()
    }

    return (
        <ValidationFeedback
            valid={valid}
            invalidFeedback={invalidFeedback}
            showValidation={showValidation}
            asyncValidationInProgress={asyncValidationInProgress}
        >
            <div className="address-input">
                <div className="address-row address-row-1">
                    <ValidatedInput
                        name="line1"
                        value={value.line1}
                        onChange={line1 => onChange({ ...value, line1 })}
                        validators={fieldValidators.line1}
                        inputAttributes={{
                            placeholder: 'Line 1',
                            'aria-label': 'Address line 1'
                        }}
                        enabled={enabled}
                        {...vProps}
                    />
                </div>
                <div className="address-row address-row-2">
                    <ValidatedInput
                        name="line2"
                        value={value.line2}
                        onChange={line2 => onChange({ ...value, line2 })}
                        validators={fieldValidators.line2}
                        inputAttributes={{
                            placeholder: 'Line 2',
                            'aria-label': 'Address line 2'
                        }}
                        enabled={enabled}
                        {...vProps}
                    />
                </div>
                <div className="address-row address-row-3">
                    <div className="city-input-container">
                        <ValidatedInput
                            name="city"
                            value={value.city}
                            onChange={city => onChange({ ...value, city })}
                            validators={fieldValidators.city}
                            inputAttributes={{
                                placeholder: 'City',
                                'aria-label': 'City'
                            }}
                            enabled={enabled}
                            {...vProps}
                        />
                    </div>
                    <ValidatedSelect
                        name="state"
                        value={value.state ? value.state.toUpperCase() : null}
                        onChange={useCallback(
                            state =>
                                onChange({
                                    ...value,
                                    state: state !== null ? (state as string) : ''
                                }),
                            [value, onChange]
                        )}
                        options={stateOptions}
                        width={115}
                        placeholder="State"
                        validators={fieldValidators.state}
                        isClearable={!individualInputsRequired}
                        aria-label="State"
                        enabled={enabled}
                        getStyles={getStateSelectStyles}
                        {...vProps}
                    />
                    <ValidatedInput
                        name="postalCode"
                        value={value.postalCode}
                        onChange={postalCode => onChange({ ...value, postalCode })}
                        validators={fieldValidators.postalCode}
                        inputAttributes={{
                            placeholder: 'ZIP', // "Postal code" is too long
                            'aria-label': allowCanadian ? 'Postal code' : 'ZIP'
                        }}
                        enabled={enabled}
                        {...vProps}
                    />
                </div>
            </div>
        </ValidationFeedback>
    )
}

AddressInput.defaultProps = {
    enabled: true
}
