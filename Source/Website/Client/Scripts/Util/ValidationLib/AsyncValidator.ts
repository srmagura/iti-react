const debounce = require('lodash/debounce');
import { IValidatorOutput } from './ValidatorCore';
import { ICancellablePromise, cancellableThen } from './CancellablePromise';

export type AsyncValidator<TInput = string> = (value: TInput) => ICancellablePromise<IValidatorOutput>

export class AsyncValidatorRunner<TInput = string> {

    private readonly validator: AsyncValidator<TInput>
    private readonly onResultReceived: (output: IValidatorOutput, inputThatWasValidated: TInput) => void
    private readonly onInProgressChange?: (inProgress: boolean) => void
    private readonly onError?: (e?: any) => void

    private currentlyValidatingInput?: TInput
    private promise?: ICancellablePromise<void>

    constructor(options: {
        validator: AsyncValidator<TInput>
        onResultReceived: (output: IValidatorOutput, inputThatWasValidated: TInput) => void
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
        if (this.onInProgressChange)
            this.onInProgressChange(inProgress)
    }

    handleInputChange = (value: TInput) => {
        if (this.promise)
            this.promise.cancel()

        const promise = this.validator(value)

        this.currentlyValidatingInput = value

        this.safe_onInProgressChange(true)

        this.promise = cancellableThen(promise,
            output => {
                this.onResultReceived(output, this.currentlyValidatingInput as TInput)
                this.safe_onInProgressChange(false)
            },
            e => {
                if(this.onError)
                    this.onError(e)

                this.safe_onInProgressChange(false)
            })
    }

    dispose = () => {
        if (this.promise)
            this.promise.cancel()
    }
}