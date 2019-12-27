import React, { useState } from 'react'
import {
    EasyFormDialog,
    useFieldValidity,
    fieldValidityIsValid,
    Validators,
    ValidatedInput,
    FormCheck
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { FormGroup } from 'Components'

interface TestEasyFormDialogProps {
    onSuccess(responseData: number): Promise<void>
    onClose(): void
}

export function TestEasyFormDialog(props: TestEasyFormDialogProps) {
    const { onSuccess, onClose } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const [showValidation, setShowValidation] = useState(false)
    const vProps = { showValidation, onValidChange: onChildValidChange }

    async function submit(formData: any) {
        await api.product.performOperation({
            error: !!formData.error
        })

        return {
            shouldClose: !!formData.shouldClose,
            responseData: parseInt(formData.responseData)
        }
    }

    return (
        <EasyFormDialog
            title={
                <span style={{ color: 'purple' }}>
                    Test Easy Form Dialog (title is a JSX element)
                </span>
            }
            actionButtonText="Save changes"
            formIsValid={fieldValidityIsValid(fieldValidity)}
            onShowValidationChange={setShowValidation}
            onSubmit={submit}
            onSuccess={onSuccess}
            onClose={onClose}
        >
            <FormGroup label="Response data (integer)">
                {id => (
                    <ValidatedInput
                        id={id}
                        name="responseData"
                        validators={[Validators.required(), Validators.integer()]}
                        {...vProps}
                    />
                )}
            </FormGroup>
            <div className="form-group">
                <FormCheck name="error" label="API call should throw error" />
                <FormCheck name="shouldClose" label="Should close" defaultChecked />
            </div>
        </EasyFormDialog>
    )
}
