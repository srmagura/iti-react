/* eslint-disable jest/expect-expect -- TypeScript tests */
import { ITIAction, ITIDispatch } from './ITIAction'

const dispatch: ITIDispatch = (action) => action

// eslint-disable-next-line
const dispatch2: ITIDispatch = (action) => {}

it('accepts valid actions', () => {
    const addAction: ITIAction = { type: 'add' }
    dispatch(addAction)

    dispatch({
        type: 'add',
    })

    dispatch({
        type: 'add',
        payload: { foobar: 1 },
        meta: { foobar: 1 },
    })
})

it('errors if passed a function', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const actionCreator = () => ({ type: 'add' })

    // @ts-expect-error -- testing that action creator not being called results in an error
    dispatch(actionCreator)
})
