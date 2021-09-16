import React from 'react'
import {
    ValidatedInput,
    Validators,
    SubmitButton,
    areAnyInProgress,
    useFieldValidity,
    useValidationInProgressMonitor,
} from '@interface-technologies/iti-react'
import { api } from 'Api'
import { CancellablePromise } from 'real-cancellable-promise'

interface AsyncValidationSectionProps {
    showValidation: boolean
}

export function AsyncValidationSection(props: AsyncValidationSectionProps) {
    const { showValidation } = props

    const [onChildValidChange, fieldValidity] = useFieldValidity()
    const [onChildProgressChange, validationProgress] = useValidationInProgressMonitor()
    const validationInProgress = areAnyInProgress({
        ...validationProgress,
        Input1: false,
    })

    const vProps = {
        showValidation,
        onValidChange: onChildValidChange,
        onAsyncValidationInProgressChange: onChildProgressChange,
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
                        asyncValidator={(value) => {
                            return api.product
                                .isValid({
                                    s: value,
                                })
                                .then(({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`,
                                }))
                        }}
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
                        {...vProps}
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
                        asyncValidator={(value) => {
                            return api.product
                                .isValid({
                                    s: value,
                                })
                                .then(({ valid, reason }) => ({
                                    valid,
                                    invalidFeedback: `The server says your input is invalid because: ${reason}`,
                                }))
                        }}
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
                        asyncValidator={() =>
                            CancellablePromise.resolve({
                                valid: true,
                                invalidFeedback: 'No feedback',
                            })
                        }
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label>
                        useValidationInProgressMonitor test - validationInProgress ={' '}
                        {validationInProgress.toString()} - ignores InternalServerError
                        input
                    </label>
                    <div>
                        <SubmitButton
                            type="button"
                            onClick={() =>
                                console.log(
                                    'Would have submitted the form (if it is valid).'
                                )
                            }
                            submitting={false}
                            className="btn btn-primary"
                            enabled={!validationInProgress}
                        >
                            Submit
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
