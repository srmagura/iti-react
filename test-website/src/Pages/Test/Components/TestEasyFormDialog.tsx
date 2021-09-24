import { useState } from 'react'
import {
    useFieldValidity,
    Validators,
    ValidatedInput,
    FormCheck,
    FormGroup,
    EasyFormDialog,
} from '@interface-technologies/iti-react'
import { api } from 'Api'

interface TestEasyFormDialogProps {
    onSuccess(responseData: number): Promise<void>
    onClose(): void
}

export function TestEasyFormDialog({ onSuccess, onClose }: TestEasyFormDialogProps) {
    const { onChildValidChange, allFieldsValid } = useFieldValidity()
    const [showValidation, setShowValidation] = useState(false)
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [error, setError] = useState(false)
    const [shouldClose, setShouldClose] = useState(true)
    const [anyValidationInProgress, setAnyValidationInProgress] = useState(false)
    const [responseData, setResponseData] = useState('')

    async function submit() {
        await api.product.performOperation({
            error,
        })

        return {
            shouldClose,
            responseData: parseInt(responseData),
        }
    }

    return (
        <EasyFormDialog
            title={
                <span style={{ color: 'purple' }}>
                    Test Easy Form Dialog (title is a JSX element)
                </span>
            }
            submitButtonText="Save changes"
            formIsValid={allFieldsValid}
            onShowValidationChange={setShowValidation}
            validationInProgress={anyValidationInProgress}
            onSubmit={submit}
            onSuccess={onSuccess}
            onClose={onClose}
        >
            <FormGroup label="Response data (integer)">
                {(id) => (
                    <ValidatedInput
                        id={id}
                        name="responseData"
                        validators={[Validators.required(), Validators.integer()]}
                        value={responseData}
                        onChange={setResponseData}
                        {...vProps}
                    />
                )}
            </FormGroup>
            <div className="form-group">
                <FormCheck
                    label="API call should throw error"
                    checked={error}
                    onChange={() => setError((b) => !b)}
                    inline={false}
                />
                <FormCheck
                    label="Should close"
                    checked={shouldClose}
                    onChange={() => setShouldClose((b) => !b)}
                    inline={false}
                />
                <FormCheck
                    label="Async validation in progress"
                    checked={anyValidationInProgress}
                    onChange={() => setAnyValidationInProgress((b) => !b)}
                    inline={false}
                />
            </div>
        </EasyFormDialog>
    )
}
