import { render } from '@testing-library/react'
import {
    ASYNC_VALIDATION_PENDING,
    INVALID_NO_FEEDBACK,
} from '@interface-technologies/iti-react-core'
import { ValidationFeedback } from '../../Validation'
import { DefaultProviders, waitForReactUpdates } from '../__helpers__'

it('does not render feedback if valid', () => {
    render(
        <DefaultProviders>
            <ValidationFeedback validatorOutput={undefined} showValidation />
        </DefaultProviders>
    )

    expect(document.querySelector('.validated-input')).toBeEmptyDOMElement()
})

it('does not render feedback if validatorOutput=INVALID_NO_FEEDBACK', () => {
    render(
        <DefaultProviders>
            <ValidationFeedback validatorOutput={INVALID_NO_FEEDBACK} showValidation />
        </DefaultProviders>
    )

    expect(document.querySelector('.validated-input')).toBeEmptyDOMElement()
})

it('renders feedback if invalid', () => {
    render(
        <DefaultProviders>
            <ValidationFeedback validatorOutput="myFeedback" showValidation />
        </DefaultProviders>
    )

    const invalidFeedback = document.querySelector('.invalid-feedback')
    expect(invalidFeedback).toBeVisible()
    expect(invalidFeedback).toHaveTextContent('myFeedback')

    expect(document.querySelector('.pending-feedback')).toBeNull()
})

it('shows loading indicator after a delay if validatorOutput=ASYNC_VALIDATION_PENDING', async () => {
    const { rerender } = render(
        <DefaultProviders>
            <ValidationFeedback
                validatorOutput={ASYNC_VALIDATION_PENDING}
                showValidation
            />
        </DefaultProviders>
    )

    expect(document.querySelector('.invalid-feedback')).toBeNull()
    expect(document.querySelector('.pending-feedback')).toBeNull()

    await waitForReactUpdates()
    expect(document.querySelector('.invalid-feedback')).toBeNull()

    const pendingFeedback = document.querySelector('.pending-feedback')
    expect(pendingFeedback).toBeVisible()
    expect(pendingFeedback).toHaveTextContent(/LOADING INDICATOR/)
    expect(pendingFeedback).toHaveTextContent(/Validating\.\.\./)

    rerender(
        <DefaultProviders>
            <ValidationFeedback validatorOutput={undefined} showValidation />
        </DefaultProviders>
    )

    // Pending feedback should be removed immediately
    expect(document.querySelector('.invalid-feedback')).toBeNull()
    expect(document.querySelector('.pending-feedback')).toBeNull()
})
