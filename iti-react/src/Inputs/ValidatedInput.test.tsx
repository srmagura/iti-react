import { render } from '@testing-library/react'
import { CancellablePromise } from 'real-cancellable-promise'
import { ValidatedInput } from './ValidatedInput'

it('does not update the component asynchoronously when there is no asyncValidator', async () => {
    const consoleErrorMock = jest.fn()
    console.error = consoleErrorMock

    render(
        <ValidatedInput
            name="test"
            value=""
            onChange={jest.fn()}
            validators={[]}
            showValidation={false}
        />
    )

    // purposefully not using waitForReactUpdates which uses `act`
    const delay = CancellablePromise.delay(2000)
    jest.runAllTimers()
    await delay

    // ensure no "component updated outside of an act() call" error
    expect(consoleErrorMock).not.toHaveBeenCalled()
})
