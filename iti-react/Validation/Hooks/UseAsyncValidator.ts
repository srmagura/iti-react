import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import { useQuery } from '@interface-technologies/iti-react/Hooks'
import {
    ValidatorOutput,
    AsyncValidator
} from '@interface-technologies/iti-react/Validation/ValidatorCore'
import { CancellablePromise } from '@interface-technologies/iti-react-core'
import { usePrevious } from '@interface-technologies/iti-react/Hooks'

// Not for use outside of iti-react
export function useAsyncValidator<TValue>(options: {
    value: TValue
    validationKey: string | number | undefined

    asyncValidator: AsyncValidator<TValue> | undefined
    onError(e: any): void
}) {
    const { value, validationKey, asyncValidator, onError } = options

    const [asyncValidationInProgress, setAsyncValidationInProgress] = useState(false)

    const pendingValidatorOutput: ValidatorOutput = {
        valid: false,
        invalidFeedback: undefined
    }

    const defaultValidatorOutput = asyncValidator
        ? pendingValidatorOutput
        : { valid: true, invalidFeedback: undefined }

    const [asyncValidatorOutput, setAsyncValidatorOutput] = useState<ValidatorOutput>(
        defaultValidatorOutput
    )

    const { doQuery } = useQuery<ValidatorOutput>({
        query: () => {
            if (!asyncValidator) {
                return CancellablePromise.resolve({ valid: true, invalidFeedback: '' })
            }

            return asyncValidator(value)
        },
        onResultReceived: setAsyncValidatorOutput,
        onLoadingChange: setAsyncValidationInProgress,
        onError
    })

    const prevValue = usePrevious(value)
    const prevValidationKey = usePrevious(validationKey)

    useEffect(() => {
        if (!isEqual(prevValue, value) || prevValidationKey !== validationKey) {
            setAsyncValidatorOutput(pendingValidatorOutput)
            doQuery()
        }
    })

    return { asyncValidatorOutput, asyncValidationInProgress }
}

//        asyncValidatorRunner?: AsyncValidatorRunner<TValue>

//        showAsyncTimer?: number

//        constructor(props: WithValidationProps<TValue> & TOwnProps) {
//            super(props)

//            this.state = {
//                value: value,
//                asyncValidationInProgress: false,
//                showAsyncValidationInProgress: false,
//                asyncValidatorOutput: undefined
//            }
//        }

//        componentDidMount() {
//            this.recreateAsyncValidatorRunner()
//        }

//        onAsyncResultReceived = (output: ValidatorOutput) => {
//            const { onValidChange, name } = this.props
//            const { value } = this.state

//            if (onValidChange) {
//                const syncValid = this.getCombinedValidatorOutput(value).valid
//                onValidChange(name, output.valid && syncValid)
//            }

//            this.setState(s => ({
//                ...s,
//                asyncValidatorOutput: output
//            }))
//        }

//        onAsyncError = (e: any) => {
//            // doesn't change the validity at all

//            if (this.props.onAsyncError) this.props.onAsyncError(e)
//        }

//        onAsyncInProgressChange = (inProgress: boolean) => {
//            const { name, onAsyncValidationInProgressChange } = this.props

//            if (onAsyncValidationInProgressChange) {
//                onAsyncValidationInProgressChange(name, inProgress)
//            }

//            if (inProgress !== this.state.asyncValidationInProgress) {
//                this.setState(s => ({
//                    ...s,
//                    asyncValidationInProgress: inProgress,
//                    showAsyncValidationInProgress: false
//                }))

//                if (this.showAsyncTimer) window.clearTimeout(this.showAsyncTimer)

//                if (inProgress) {
//                    // Only show a "validation in progress" message if the network request is taking over
//                    // a second to complete.
//                    this.showAsyncTimer = window.setTimeout(() => {
//                        this.setState({
//                            showAsyncValidationInProgress: true
//                        })
//                    }, 1000)
//                }
//            }
//        }

//        recreateAsyncValidatorRunner = () => {
//            const { asyncValidator } = this.props

//            if (this.asyncValidatorRunner) {
//                this.asyncValidatorRunner.dispose()
//                this.asyncValidatorRunner = undefined
//            }

//            if (asyncValidator) {
//                this.asyncValidatorRunner = new AsyncValidatorRunner({
//                    validator: asyncValidator as AsyncValidator<TValue>,
//                    onResultReceived: this.onAsyncResultReceived,
//                    onInProgressChange: this.onAsyncInProgressChange,
//                    onError: this.onAsyncError
//                })
//            }
//        }

//        componentDidUpdate(
//            prevProps: WithValidationProps<TValue>,
//            prevState: WithValidationState<TValue>
//        ) {
//            const { validationKey } = this.props
//            const { value } = this.state

//            const keyChanged = prevProps.validationKey !== validationKey
//            if (keyChanged) {
//                this.recreateAsyncValidatorRunner()
//            }

//            if (!isEqual(value, prevState.value) || keyChanged) {
//                this.forceValidate(value)
//            }
//        }

//        componentWillUnmount() {
//            if (this.asyncValidatorRunner) this.asyncValidatorRunner.dispose()

//            if (typeof this.showAsyncTimer !== 'undefined') {
//                window.clearTimeout(this.showAsyncTimer)
//            }
//        }

/*
export class AsyncValidatorRunner<TInput> {
    private readonly validator: AsyncValidator<TInput>
    private readonly onResultReceived: (
        output: ValidatorOutput,
        inputThatWasValidated: TInput
    ) => void
    private onInProgressChange?: (inProgress: boolean) => void
    private onError?: (e?: any) => void

    private currentlyValidatingInput?: TInput
    private promise?: CancellablePromise<any>

    constructor(options: {
        validator: AsyncValidator<TInput>
        onResultReceived: (output: ValidatorOutput, inputThatWasValidated: TInput) => void
        onInProgressChange?: (inProgress: boolean) => void
        onError?: (e?: any) => void
    }) {
        const { validator, onResultReceived, onInProgressChange, onError } = options
        this.onResultReceived = onResultReceived
        this.onInProgressChange = onInProgressChange
        this.onError = onError

        this.validator = validator
        this.handleInputChange = debounce(this.handleInputChange, 400)
    }

    private safe_onInProgressChange = (inProgress: boolean) => {
        if (this.onInProgressChange) this.onInProgressChange(inProgress)
    }

    handleInputChange = async (input: TInput) => {
        if (this.promise) this.promise.cancel()

        const promise = this.validator(input)

        this.currentlyValidatingInput = input

        this.safe_onInProgressChange(true)

        try {
            const output = await (this.promise = promise)

            this.onResultReceived(output, this.currentlyValidatingInput as TInput)
            this.safe_onInProgressChange(false)
        } catch (e) {
            if (this.onError) this.onError(e)

            this.safe_onInProgressChange(false)
        }
    }

    dispose = () => {
        // Callbacks must not be called after dispose() is called
        this.onError = undefined
        this.onInProgressChange = undefined

        if (this.promise) this.promise.cancel()
    }
}
*/
