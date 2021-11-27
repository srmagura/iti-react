import React, { ReactElement, useState } from 'react'
import {
    ValidatedInput,
    Validators,
    useFieldValidity,
    AsyncValidator,
} from '@interface-technologies/iti-react'
import { api } from 'api'
import { CancellablePromise } from 'real-cancellable-promise'

interface Options0 {
    required: boolean
    maxLength: boolean
}

interface Options1 {
    maxLength: boolean
    mustContain: 'cool' | 'nice' | undefined
}

interface ChangeValidatorSectionProps {
    showValidation: boolean
}

export function ChangeValidatorSection({
    showValidation,
}: ChangeValidatorSectionProps): ReactElement {
    const { onChildValidChange, fieldValidity } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    const [options0, setOptions0] = useState<Options0>({
        required: false,
        maxLength: false,
    })
    const [options1, setOptions1] = useState<Options1>({
        maxLength: false,
        mustContain: undefined,
    })

    function getAsyncValidator(
        mustContain: 'cool' | 'nice' | undefined
    ): AsyncValidator<string> | undefined {
        if (!mustContain) return () => CancellablePromise.resolve(undefined)

        return (value: string) => {
            const apiCallPromise =
                mustContain === 'cool'
                    ? api.product.isValid({ s: value })
                    : api.product.isValid2({ s: value })

            return apiCallPromise.then(({ valid, reason }) =>
                valid
                    ? undefined
                    : `The server says your input is invalid because: ${reason}`
            )
        }
    }

    const maxLength = 5

    const validators0 = []
    if (options0.required) {
        validators0.push(Validators.required())
    }

    if (options0.maxLength) {
        validators0.push(Validators.maxLength(maxLength))
    }

    const validators1 = []
    if (options1.maxLength) {
        validators1.push(Validators.maxLength(maxLength))
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Changeable Validators</h5>
                <div className="form-group">
                    <label className="space-children">
                        <label>
                            <input
                                type="checkbox"
                                checked={options0.required}
                                onChange={() =>
                                    setOptions0((o) => ({
                                        ...o,
                                        required: !o.required,
                                    }))
                                }
                            />{' '}
                            Required
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={options0.maxLength}
                                onChange={() =>
                                    setOptions0((o) => ({
                                        ...o,
                                        maxLength: !o.maxLength,
                                    }))
                                }
                            />{' '}
                            Max length = {maxLength}
                        </label>
                        <span>Valid = {(fieldValidity.Input0 === true).toString()}</span>
                    </label>
                    <ValidatedInput
                        name="Input0"
                        validators={validators0}
                        validationKey={JSON.stringify(options0)}
                        {...vProps}
                    />
                </div>
                <div className="form-group">
                    <label className="space-children">
                        <label>
                            <input
                                type="checkbox"
                                checked={options1.maxLength}
                                onChange={() =>
                                    setOptions1((o) => ({
                                        ...o,
                                        maxLength: !o.maxLength,
                                    }))
                                }
                            />{' '}
                            Max length = {maxLength}
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={options1.mustContain === 'cool'}
                                onChange={() =>
                                    setOptions1((o) => ({
                                        ...o,
                                        mustContain: 'cool',
                                    }))
                                }
                            />{' '}
                            Must contain cool
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={options1.mustContain === 'nice'}
                                onChange={() =>
                                    setOptions1((o) => ({
                                        ...o,
                                        mustContain: 'nice',
                                    }))
                                }
                            />{' '}
                            Must contain nice
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="asyncValidator1"
                                checked={!options1.mustContain}
                                onChange={() =>
                                    setOptions1((o) => ({
                                        ...o,
                                        mustContain: undefined,
                                    }))
                                }
                            />{' '}
                            Neither
                        </label>
                        <span>Valid = {(fieldValidity.Input1 === true).toString()}</span>
                    </label>
                    <ValidatedInput
                        name="Input1"
                        validators={validators1}
                        asyncValidator={getAsyncValidator(options1.mustContain)}
                        validationKey={JSON.stringify(options1)}
                        {...vProps}
                    />
                </div>
            </div>
        </div>
    )
}
