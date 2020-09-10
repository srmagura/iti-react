import { act } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '../../TestHelpers'

export const waitForHookUpdates = waitForReactUpdatesFactory(act)
