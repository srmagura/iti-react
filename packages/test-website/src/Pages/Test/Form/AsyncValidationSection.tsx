import {
    ValidatedInput,
    Validators,
    SubmitButton,
    useFieldValidity,
    alert,
    getSubmitEnabled,
} from '@interface-technologies/iti-react'
import { api } from 'api'
import { CancellablePromise } from 'real-cancellable-promise'

interface AsyncValidationSectionProps {
    showValidation: boolean
}

export function AsyncValidationSection({ showValidation }: AsyncValidationSectionProps) {
    const { onChildValidChange, allFieldsValid, fieldValidity } = useFieldValidity()

    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Async Validation</h5>
                <div className="form-group">
                    <label>{`Must contain "cool" and be at least 4 characters - valid: ${(
                        fieldValidity.Input0 === true
                    ).toString()}`}</label>
                    <ValidatedInput
                        name="Input0"
                        validators={[Validators.required(), Validators.minLength(4)]}
                        defaultValue="default value"
                        asyncValidator={(value) =>
                            api.product
                                .isValid({
                                    s: value,
                                })
                                .then(({ valid, reason }) =>
                                    valid
                                        ? undefined
                                        : `The server says your input is invalid because: ${reason}`
                                )
                        }
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        InternalServerError - check console to see error from server
                    </label>
                    <ValidatedInput
                        name="Input1"
                        validators={[]}
                        asyncValidator={() => api.product.internalServerError({}) as any}
                        onAsyncError={(e) => {
                            console.log('Received async error:')
                            console.log(e)
                        }}
                        showValidation={showValidation}
                        // no onValidChange since it's always invalid
                    />
                </div>
                <div className="form-group">
                    <label>
                        Test that blank field gets validated - should have an validation
                        error message below
                    </label>
                    <ValidatedInput
                        name="Input2"
                        validators={[]}
                        asyncValidator={(value) =>
                            api.product
                                .isValid({
                                    s: value,
                                })
                                .then(({ valid, reason }) =>
                                    valid
                                        ? undefined
                                        : `The server says your input is invalid because: ${reason}`
                                )
                        }
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        Test that blank field gets validated - should be successful
                    </label>
                    <ValidatedInput
                        name="Input2"
                        validators={[]}
                        asyncValidator={() => CancellablePromise.resolve(undefined)}
                        {...vProps}
                    />
                </div>
                <SubmitButton
                    type="button"
                    onClick={() => alert('Would have submitted the form.')}
                    submitting={false}
                    className="btn btn-primary"
                    enabled={getSubmitEnabled(allFieldsValid, showValidation)}
                >
                    Submit
                </SubmitButton>
            </div>
        </div>
    )
}
