import React, { useCallback, useContext, useMemo } from 'react'
import {
    Validator,
    Validators,
    useControlledValue,
    useValidation,
    UseValidationProps,
} from '@interface-technologies/iti-react-core'
import {
    GetSelectStyles,
    ValidatedSelect,
    SelectValue,
    SelectValidators,
} from '../Select'
import { postalCodeValidator } from './PostalCodeValidator'
import { InternalAddressValidators } from './AddressValidators'
import { ItiReactContext } from '../../ItiReactContext'
import { getStateOptions } from './States'
import { ValidationFeedback } from '../../Validation'
import { ValidatedInput } from '../ValidatedInput'
import { AddressInputValue, defaultAddressInputValue } from './AddressInputValue'

export interface AddressInputProps extends UseValidationProps<AddressInputValue> {
    individualInputsRequired: boolean
    enabled?: boolean

    getStateSelectStyles?: GetSelectStyles
    allowCanadian?: boolean
}

/**
 * A validated address input. Supports US and Canadian addresses.
 *
 * Field lengths and the default value of `allowCanadian` are configured via
 * [[`ItiReactContext`]].
 */
export const AddressInput = React.memo(
    ({
        showValidation,
        getStateSelectStyles,
        individualInputsRequired,
        enabled = true,
        ...otherProps
    }: AddressInputProps) => {
        const context = useContext(ItiReactContext)
        const fieldLengths = context.fieldLengths.address
        const allowCanadian =
            otherProps.allowCanadian ?? context.addressInput.allowCanadian

        const validators: Validator<AddressInputValue>[] = [
            ...otherProps.validators,
            InternalAddressValidators.allFieldsValid({ allowCanadian }),
            InternalAddressValidators.allFieldLengthsValid(fieldLengths),
        ]

        if (!individualInputsRequired) {
            // this validator is only needed for optional addresses
            validators.push(InternalAddressValidators.disallowPartialAddress())
        }

        const fieldValidators = useMemo(() => {
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
                postalCode: [
                    ...baseFieldValidators,
                    postalCodeValidator({ allowCanadian }),
                ],
            }
        }, [individualInputsRequired, fieldLengths, allowCanadian])

        const { value, onChange } = useControlledValue({
            value: otherProps.value,
            onChange: otherProps.onChange,
            defaultValue: otherProps.defaultValue,
            fallbackValue: defaultAddressInputValue,
        })

        const validatorOutput = useValidation({
            value,
            name: otherProps.name,
            onValidChange: otherProps.onValidChange,
            validators,
            validationKey: otherProps.validationKey,
            asyncValidator: otherProps.asyncValidator,
            onAsyncError: otherProps.onAsyncError,
            formLevelValidatorOutput: otherProps.formLevelValidatorOutput,
        })

        const stateOptions = useMemo(
            () =>
                getStateOptions({
                    includeUsStates: true,
                    includeCanadianProvinces: allowCanadian,
                }),
            [allowCanadian]
        )

        const vProps = {
            showValidation,
            validationKey: individualInputsRequired.toString(),
        }

        return (
            <ValidationFeedback
                validatorOutput={validatorOutput}
                showValidation={showValidation}
            >
                <div className="address-input">
                    <div className="address-row address-row-1">
                        <ValidatedInput
                            name="line1"
                            value={value.line1}
                            onChange={(line1): void => onChange({ ...value, line1 })}
                            validators={fieldValidators.line1}
                            inputAttributes={{
                                placeholder: 'Line 1',
                                'aria-label': 'Address line 1',
                            }}
                            enabled={enabled}
                            {...vProps}
                        />
                    </div>
                    <div className="address-row address-row-2">
                        <ValidatedInput
                            name="line2"
                            value={value.line2}
                            onChange={(line2): void => onChange({ ...value, line2 })}
                            validators={fieldValidators.line2}
                            inputAttributes={{
                                placeholder: 'Line 2',
                                'aria-label': 'Address line 2',
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
                                onChange={(city): void => onChange({ ...value, city })}
                                validators={fieldValidators.city}
                                inputAttributes={{
                                    placeholder: 'City',
                                    'aria-label': 'City',
                                }}
                                enabled={enabled}
                                {...vProps}
                            />
                        </div>
                        {/* This div's only purpose is to allow cypress tests to find the state select */}
                        <div className="state-select">
                            {/* memo-optimized component */}
                            <ValidatedSelect
                                name="state"
                                value={value.state ? value.state.toUpperCase() : null}
                                onChange={useCallback(
                                    (state) =>
                                        onChange({
                                            ...value,
                                            state:
                                                state !== null ? (state as string) : '',
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
                        </div>
                        <ValidatedInput
                            name="postalCode"
                            value={value.postalCode}
                            onChange={(postalCode): void =>
                                onChange({ ...value, postalCode })
                            }
                            validators={fieldValidators.postalCode}
                            inputAttributes={{
                                placeholder: 'ZIP', // "Postal code" is too long
                                'aria-label': allowCanadian ? 'Postal code' : 'ZIP',
                            }}
                            enabled={enabled}
                            {...vProps}
                        />
                    </div>
                </div>
            </ValidationFeedback>
        )
    }
)
