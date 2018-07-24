import * as React from 'react'
import {
    childValidChange,
    Validators,
    ValidatedInput,
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps,
    Validator,
    ITIReactContext
} from '..'

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

/***** React component *****/

interface IAddressInputOwnProps extends React.Props<any> {
    individualInputsRequired?: boolean
    fieldLengths: {
        line1: number
        line2: number
        city: number
        zip: number
    }
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
                    {...vProps}
                />
                <ValidatedInput
                    name="line2"
                    value={value.line2}
                    onChange={line2 => onChange({ ...value, line2 })}
                    validators={[Validators.maxLength(fieldLengths.line2)]}
                    {...vProps}
                />
                <ValidatedInput
                    name="city"
                    value={value.city}
                    onChange={city => onChange({ ...value, city })}
                    validators={[Validators.maxLength(fieldLengths.city)]}
                    {...vProps}
                />
                <ValidatedInput
                    name="state"
                    type="select"
                    value={value.state}
                    onChange={state => onChange({ ...value, state })}
                    validators={[]}
                    {...vProps}
                >
                    {/*Object.keys(states).map((abbrev: string) => (
                        <option key={abbrev} value={abbrev}>
                            {abbrev}
                        </option>
                    ))*/}
                </ValidatedInput>
                <ValidatedInput
                    name="zip"
                    value={value.zip}
                    onChange={zip => onChange({ ...value, zip })}
                    validators={[Validators.maxLength(fieldLengths.zip)]}
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

//const formatValidator: Validator<AddressInputValue> = (v: AddressInputValue) => {
//let valid = false

//if (v.moment && v.moment.isValid()) {
//    valid = true
//} else if (v.raw.length === 0) {
//    valid = true
//}

//return {
//    valid,
//    invalidFeedback: getInvalidFeedback(v.includesTime)
//}
//}

export function AddressInput(
    props: IWithValidationProps<AddressInputValue> & {
        individualInputsRequired?: boolean
    }
) {
    const validators = props.validators
    // const validators = [formatValidator].concat(props.validators)
    return (
        <ITIReactContext.Consumer>
            {data => (
                <AddressInputWithValidation
                    {...props}
                    validators={validators}
                    fieldLengths={data.fieldLengths.address}
                />
            )}
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
