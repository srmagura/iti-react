import { ReactElement, useState } from 'react'
import {
    AddressInput,
    AddressValidators,
    AddressInputValue,
    defaultAddressInputValue,
    getSelectStyles,
    useFieldValidity,
    SelectOption,
} from '@interface-technologies/iti-react'
import { ControlProps, CSSObjectWithLabel, GroupBase } from 'react-select'
import { TestFormGroup } from './TestFormGroup'

interface AddressInputSectionProps {
    showValidation: boolean
}

export function AddressInputSection({
    showValidation,
}: AddressInputSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [value1, setValue1] = useState<AddressInputValue>({
        ...defaultAddressInputValue,
        state: 'va', // testing that state is case-insenstive
    })

    return (
        <div className="address-input-section">
            <TestFormGroup label="Not required" valid={fieldValidity.addressInput0}>
                <AddressInput
                    name="addressInput0"
                    individualInputsRequired={false}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label={<>Required &amp; controlled with custom select style</>}
                valid={fieldValidity.addressInput1}
            >
                <AddressInput
                    name="addressInput1"
                    value={value1}
                    onChange={setValue1}
                    validators={[AddressValidators.required()]}
                    individualInputsRequired
                    getStateSelectStyles={(options) => {
                        const defaultStyles = getSelectStyles(options)

                        return {
                            ...defaultStyles,
                            control: (
                                base: CSSObjectWithLabel,
                                props: ControlProps<
                                    SelectOption,
                                    boolean,
                                    GroupBase<SelectOption>
                                >
                            ) => ({
                                ...defaultStyles.control(base, props),
                                backgroundColor: 'orchid',
                            }),
                        }
                    }}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup label="Disabled" valid={fieldValidity.addressInput2}>
                <AddressInput
                    name="addressInput2"
                    enabled={false}
                    individualInputsRequired={false}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
            <TestFormGroup
                label="Disallow Canadian addresses"
                valid={fieldValidity.addressInput3}
            >
                <AddressInput
                    name="addressInput3"
                    allowCanadian={false}
                    individualInputsRequired={false}
                    validators={[]}
                    {...vProps}
                />
            </TestFormGroup>
        </div>
    )
}
