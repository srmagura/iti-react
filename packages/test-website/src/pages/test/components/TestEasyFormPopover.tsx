import {
    EasyFormPopover,
    FormGroup,
    useFieldValidity,
    ValidatedInput,
    Validators,
    FormCheck,
} from '@interface-technologies/iti-react'
import { api } from 'api'
import { ReactElement, useState } from 'react'

interface TestEasyFormPopoverProps {
    onSuccess(responseData: number): Promise<void>
    onClose(): void
}

export function TestEasyFormPopover({
    onSuccess,
    onClose,
}: TestEasyFormPopoverProps): ReactElement {
    const { onChildValidChange, allFieldsValid } = useFieldValidity()
    const [showValidation, setShowValidation] = useState(false)
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [error, setError] = useState(false)
    const [shouldClose, setShouldClose] = useState(true)
    const [responseData, setResponseData] = useState('')

    async function submit(): Promise<{ shouldClose: boolean; responseData: number }> {
        await api.product.performOperation({
            error,
        })

        return {
            shouldClose,
            responseData: parseInt(responseData),
        }
    }

    return (
        <EasyFormPopover
            submitButtonText="Submit"
            formIsValid={allFieldsValid}
            showValidation={showValidation}
            onShowValidationChange={setShowValidation}
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
            </div>
        </EasyFormPopover>
    )
}
