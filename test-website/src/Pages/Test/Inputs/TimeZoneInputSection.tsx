import React, { useState } from 'react'
import {
    TimeZoneValidators,
    TimeZoneInput,
    TimeZoneInputValue,
    useFieldValidity
} from '@interface-technologies/iti-react'
import { ValidityLabel } from './ValidityLabel'
import { FormGroup } from 'Components/FormGroup'

interface TimeZoneInputSectionProps {
    showValidation: boolean
}

export function TimeZoneInputSection(props: TimeZoneInputSectionProps) {
    const { showValidation } = props
    const [value0, setValue0] = useState<TimeZoneInputValue>(null)

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const vProps = {
        showValidation,
        onValidChange: onChildValidChange
    }

    return (
        <div className="form-limit-width">
            <FormGroup
                label={
                    <span>
                        Not required & controlled{' '}
                        <ValidityLabel valid={fieldValidity.timeZoneInput0} />
                    </span>
                }
            >
                {id => (
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
                )}
            </FormGroup>
            <div className="form-group">
                <label>Required & in flexbox</label>{' '}
                <ValidityLabel valid={fieldValidity.timeZoneInput1} />
                <div className="d-flex">
                    <TimeZoneInput
                        name="timeZoneInput1"
                        validators={[TimeZoneValidators.required()]}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
