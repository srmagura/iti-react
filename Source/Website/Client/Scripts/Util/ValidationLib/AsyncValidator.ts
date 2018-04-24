import debounce = require('lodash.debounce');
import { IValidatorOutput } from './ValidatorCore';
import { ICancellablePromise, cancellableThen } from './CancellablePromise';

export type AsyncValidator<TInput = string> = (value: TInput) => ICancellablePromise<IValidatorOutput>

export class AsyncValidatorRunner<TInput = string> {

    private readonly validator: AsyncValidator<TInput>
    private readonly onResultReceived: (output: IValidatorOutput, inputThatWasValidated: TInput) => void
    private readonly onInProgressChange: (inProgress: boolean) => void

    private currentlyValidatingInput?: TInput
    private promise?: ICancellablePromise<void>
   // private readonly debouncedValidator: AsyncValidator<TInput>

    constructor(options: {
        validator: AsyncValidator<TInput>
        onResultReceived: (output: IValidatorOutput, inputThatWasValidated: TInput) => void
        onInProgressChange: (inProgress: boolean) => void
    }) {
        const { validator, onResultReceived, onInProgressChange } = options
        this.onResultReceived = onResultReceived
        this.onInProgressChange = onInProgressChange

        this.validator = validator
        this.handleInputChange = debounce(this.handleInputChange, 400)
    }

    handleInputChange = (value: TInput) => {
        if (this.promise)
            this.promise.cancel()

        const promise = this.validator(value)

        this.currentlyValidatingInput = value
        this.onInProgressChange(true)

        this.promise = cancellableThen(promise, (output: IValidatorOutput) => {
            this.onResultReceived(output, this.currentlyValidatingInput as TInput)
            this.onInProgressChange(false)
        })
    }

    dispose = () => {
        if (this.promise)
            this.promise.cancel()
    }
}