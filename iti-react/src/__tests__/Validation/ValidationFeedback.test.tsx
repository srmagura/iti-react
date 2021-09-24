import { render } from '@testing-library/react'
import { ValidationFeedback } from '../../Validation'
import { ASYNC_VALIDATION_PENDING } from '@interface-technologies/iti-react-core'
import { DefaultProviders, waitForReactUpdates } from '../__helpers__'

it('does not render feedback if valid', () => {
    render(
        <DefaultProviders>
            <ValidationFeedback validatorOutput={undefined} showValidation />
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
    render(
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
})
