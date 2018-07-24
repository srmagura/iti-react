import * as React from 'react'
import {
    childValidChange,
    Validators,
    ValidatedInput,
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps,
    Validator,
    ITIReactContext,
    ValidatedSelect
} from '../..'
import { states } from './States'

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

type FieldLengths = {
    line1: number
    line2: number
    city: number
    zip: number
}

/***** React component *****/

interface IAddressInputOwnProps extends React.Props<any> {
    individualInputsRequired?: boolean
    fieldLengths: FieldLengths
}

type IAddressInputProps = IAddressInputOwnProps &
    IWithValidationInjectedProps<AddressInputValue>

interface IAddressInputState {}

class _AddressInput extends React.Component<IAddressInputProps, IAddressInputState> {
    static defaultProps: Partial<IAddressInputProps> = {
        individualInputsRequired: false
    }

    constructor(props: IAddressInputProps) {
        super(props)

        this.state = {
            fieldValidity: {}
        }
    }

    render() {
        const { value, fieldLengths, onChange, showValidation } = this.props

        const vProps = {
            showValidation
        }

        return (
            <div>
                <ValidatedInput
                    name="line1"
                    value={value.line1}
                    onChange={line1 => onChange({ ...value, line1 })}
                    validators={[Validators.maxLength(fieldLengths.line1)]}
                    inputAttributes={{
                        placeholder: 'Line 1'
                    }}
                    {...vProps}
                />
                <ValidatedInput
                    name="line2"
                    value={value.line2}
                    onChange={line2 => onChange({ ...value, line2 })}
                    validators={[Validators.maxLength(fieldLengths.line2)]}
                    inputAttributes={{
                        placeholder: 'Line 2'
                    }}
                    {...vProps}
                />
                <ValidatedInput
                    name="city"
                    value={value.city}
                    onChange={city => onChange({ ...value, city })}
                    validators={[Validators.maxLength(fieldLengths.city)]}
                    inputAttributes={{
                        placeholder: 'City'
                    }}
                    {...vProps}
                />
                <ValidatedSelect
                    name="state"
                    value={value.state ? value.state : null}
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
                    placeholder="State"
                    validators={[]}
                    isClearable
                    {...vProps}
                />
                <ValidatedInput
                    name="zip"
                    value={value.zip}
                    onChange={zip => onChange({ ...value, zip })}
                    validators={[Validators.maxLength(fieldLengths.zip)]}
                    inputAttributes={{
                        placeholder: 'ZIP'
                    }}
                    {...vProps}
                />
            </div>
        )
    }
}

const AddressInputWithValidation = withValidation<
    IAddressInputOwnProps,
    AddressInputValue
>({
    defaultValue: defaultAddressInputValue
})(_AddressInput)

/***** Validation *****/

function allFieldsLengthValidator(
    fieldLengths: FieldLengths
): Validator<AddressInputValue> {
    return (v: AddressInputValue) => ({
        valid:
            v.line1.length <= fieldLengths.line1 &&
            v.line2.length <= fieldLengths.line2 &&
            v.city.length <= fieldLengths.city &&
            v.zip.length <= fieldLengths.zip,
        invalidFeedback: ''
    })
}

export function AddressInput(
    props: IWithValidationProps<AddressInputValue> & {
        individualInputsRequired?: boolean
    }
) {
    return (
        <ITIReactContext.Consumer>
            {data => {
                const fieldLengths = data.fieldLengths.address
                const validators = [allFieldsLengthValidator(fieldLengths)].concat(
                    props.validators
                )

                return (
                    <AddressInputWithValidation
                        {...props}
                        validators={validators}
                        fieldLengths={fieldLengths}
                    />
                )
            }}
        </ITIReactContext.Consumer>
    )
}

function required(): Validator<AddressInputValue> {
    return (value: AddressInputValue) => ({
        valid: true,
        invalidFeedback: 'TODO'
    })
}

export const AddressValidators = {
    required
}
