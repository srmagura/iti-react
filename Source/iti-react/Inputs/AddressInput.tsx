import * as React from 'react'
import {
    childValidChange,
    Validators,
    ValidatedInput,
    IWithValidationInjectedProps,
    withValidation,
    IWithValidationProps,
    Validator
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

interface IAddressInputOwnProps extends React.Props<any> {
    individualInputsRequired?: boolean
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

    //childValidChange = (fieldName: string, valid: boolean) => {
    //    childValidChange(
    //        fieldName,
    //        valid,
    //        f => this.setState(f),
    //        valid => this.props.onValidChange('addressForm', valid)
    //    )
    //}

    render() {
        const { value, onChange, showValidation } = this.props

        const vProps = {
            showValidation,
            onValidChange: () => {} //this.childValidChange
        }

        return (
            <div>
                <ValidatedInput
                    name="line1"
                    value={value.line1}
                    onChange={line1 => onChange({ ...value, line1 })}
                    validators={[Validators.maxLength(64)]}
                    {...vProps}
                />
                <ValidatedInput
                    name="line2"
                    value={value.line2}
                    onChange={line2 => onChange({ ...value, line2 })}
                    validators={[Validators.maxLength(64)]}
                    {...vProps}
                />
                <ValidatedInput
                    name="city"
                    value={value.city}
                    onChange={city => onChange({ ...value, city })}
                    validators={[Validators.maxLength(64)]}
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
                    validators={[Validators.maxLength(16)]}
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
    props: IWithValidationProps<AddressInputValue> & IAddressInputOwnProps
) {
    const validators = props.validators
    // const validators = [formatValidator].concat(props.validators)
    return <AddressInputWithValidation {...props} validators={validators} />
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
