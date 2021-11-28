import { act } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '../_util'

export const waitForHookUpdates = waitForReactUpdatesFactory(act)
