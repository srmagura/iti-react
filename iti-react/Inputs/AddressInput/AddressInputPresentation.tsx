import * as React from 'react'
import {
    Validators,
    ValidatedInput,
    WithValidationInjectedProps,
    withValidation,
    Validator,
    ValidatedSelect,
    SelectValidators,
    SelectValue
} from '../..'
import { states } from './States'
import { GetSelectStyles } from '../Select'
import {
    postalCodeValidator,
    PostalCodeValidationOptions,
    defaultPostalCodeValidationOptions
} from '../../Inputs/AddressInput/PostalCodeValidator'

export type AddressInputValue = {
    line1: string
    line2: string
    city: string
    state: string
    zip: string
}

export const defaultAddressInputValue: AddressInputValue = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: ''
}

export type FieldLengths = {
    line1: number
    line2: number
    city: number
}

interface AddressInputPresentationOwnProps {
    individualInputsRequired?: boolean
    fieldLengths: FieldLengths

    enabled?: boolean
    getStateSelectStyles?: GetSelectStyles
    postalCodeValidationOptions: PostalCodeValidationOptions
}

type AddressInputPresentationProps = AddressInputPresentationOwnProps &
    WithValidationInjectedProps<AddressInputValue>

interface AddressInputPresentationState {}

class AddressInputPresentation extends React.Component<
    AddressInputPresentationProps,
    AddressInputPresentationState
> {
    static defaultProps: Pick<
        AddressInputPresentationProps,
        'individualInputsRequired' | 'enabled'
    > = {
        individualInputsRequired: false,
        enabled: true
    }

    constructor(props: AddressInputPresentationProps) {
        super(props)

        this.state = {
            fieldValidity: {}
        }
    }

    render() {
        const {
            value,
            fieldLengths,
            onChange,
            showValidation,
            getStateSelectStyles
        } = this.props
        const individualInputsRequired = this.props.individualInputsRequired!
        const enabled = this.props.enabled!
        const postalCodeValidationOptions = this.props.postalCodeValidationOptions!

        const baseValidators = []
        const stateValidators: Validator<SelectValue>[] = []

        if (individualInputsRequired) {
            baseValidators.push(Validators.required())
            stateValidators.push(SelectValidators.required())
        }

        const validators = {
            line1: [...baseValidators, Validators.maxLength(fieldLengths.line1)],
            line2: [Validators.maxLength(fieldLengths.line2)],
            city: [...baseValidators, Validators.maxLength(fieldLengths.city)],
            state: stateValidators,
            zip: [...baseValidators, postalCodeValidator(postalCodeValidationOptions)]
        }

        const vProps = {
            showValidation,
            validationKey: individualInputsRequired.toString()
        }

        return (
            <div className="address-input">
                <div className="address-row address-row-1">
                    <ValidatedInput
                        name="line1"
                        value={value.line1}
                        onChange={line1 => onChange({ ...value, line1 })}
                        validators={validators.line1}
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
                        validators={validators.line2}
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
                            validators={validators.city}
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
                        onChange={state =>
                            onChange({
                                ...value,
                                state: state !== null ? (state as string) : ''
                            })
                        }
                        options={Object.keys(states).map((abbrev: string) => ({
                            value: abbrev,
                            label: abbrev
                        }))}
                        width={115}
                        placeholder="State"
                        validators={validators.state}
                        isClearable={!individualInputsRequired}
                        aria-label="State"
                        enabled={enabled}
                        getStyles={getStateSelectStyles}
                        {...vProps}
                    />
                    <ValidatedInput
                        name="zip"
                        value={value.zip}
                        onChange={zip => onChange({ ...value, zip })}
                        validators={validators.zip}
                        inputAttributes={{
                            placeholder: 'ZIP',
                            'aria-label': 'ZIP'
                        }}
                        enabled={enabled}
                        aria-label="ZIP"
                        {...vProps}
                    />
                </div>
            </div>
        )
    }
}

export const AddressInputWithValidation = withValidation<
    AddressInputPresentationOwnProps,
    AddressInputValue
>({
    defaultValue: defaultAddressInputValue
})(AddressInputPresentation)
