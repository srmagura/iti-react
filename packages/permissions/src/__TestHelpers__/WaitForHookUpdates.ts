import { act } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '@interface-technologies/iti-react-core'

export const waitForHookUpdates = waitForReactUpdatesFactory(act)
