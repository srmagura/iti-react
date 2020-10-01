import { act } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '@interface-technologies/iti-react-core/src/TestHelpers'

export const waitForHookUpdates = waitForReactUpdatesFactory(act)
