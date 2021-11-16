import { useState } from 'react'
import {
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue,
    useFieldValidity,
    FormGroup,
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'

interface TimeZoneInputSectionProps {
    showValidation: boolean
}

export function TimeZoneInputSection({ showValidation }: TimeZoneInputSectionProps) {
    const [value0, setValue0] = useState<TimeZoneInputValue>(null)

    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div className="form-limit-width">
            <FormGroup
                label={
                    <span>
                        Not required &amp; controlled{' '}
                        <ValidityLabel valid={fieldValidity.timeZoneInput0} />
                    </span>
                }
            >
                {(id) => (
                    <>
                        <TimeZoneInput
                            id={id}
                            name="timeZoneInput0"
                            value={value0}
                            onChange={setValue0}
                            placeholder="Select time zone..."
                            isClearable
                            validators={[]}
                            {...vProps}
                        />
                        <p className="mt-2">Value: {value0}</p>
                    </>
                )}
            </FormGroup>
            <FormGroup
                label={
                    <span>
                        <span>Required &amp; in flexbox</span>{' '}
                        <ValidityLabel valid={fieldValidity.timeZoneInput1} />
                    </span>
                }
            >
                <div className="d-flex">
                    <TimeZoneInput
                        name="timeZoneInput1"
                        validators={[TimeZoneValidators.required()]}
                        width={400}
                        {...vProps}
                    />
                </div>
            </FormGroup>
            <FormGroup
                label={
                    <span>
                        <span>Disabled</span>{' '}
                        <ValidityLabel valid={fieldValidity.timeZoneInput2} />
                    </span>
                }
            >
                <TimeZoneInput
                    name="timeZoneInput2"
                    validators={[]}
                    enabled={false}
                    {...vProps}
                />
            </FormGroup>
        </div>
    )
}
