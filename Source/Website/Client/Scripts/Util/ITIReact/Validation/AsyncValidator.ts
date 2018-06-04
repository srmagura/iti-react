const debounce = require('lodash/debounce');
import { IValidatorOutput } from './ValidatorCore';
import { ICancellablePromise, cancellableThen } from '../CancellablePromise';

export type AsyncValidator<TInput> = (input: TInput) => ICancellablePromise<IValidatorOutput>

export class AsyncValidatorRunner<TInput> {

    private readonly validator: AsyncValidator<TInput>
    private readonly onResultReceived: (output: IValidatorOutput, inputThatWasValidated: TInput) => void
    private onInProgressChange?: (inProgress: boolean) => void
    private onError?: (e?: any) => void

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

    handleInputChange = (input: TInput) => {
        if (this.promise)
            this.promise.cancel()

        const promise = this.validator(input)

        this.currentlyValidatingInput = input

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
        // Callbacks must not be called after dispose() is called
        this.onError = undefined
        this.onInProgressChange = undefined

        if (this.promise)
            this.promise.cancel()
    }
}