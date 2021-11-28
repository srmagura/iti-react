import { act } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '@interface-technologies/iti-react'

export const waitForHookUpdates = waitForReactUpdatesFactory(act)
