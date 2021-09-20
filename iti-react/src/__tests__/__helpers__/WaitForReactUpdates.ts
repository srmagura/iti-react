import { act as reactAct } from '@testing-library/react'
import { act as hooksAct } from '@testing-library/react-hooks'
import { waitForReactUpdatesFactory } from '@interface-technologies/iti-react-core'

export const waitForReactUpdates = waitForReactUpdatesFactory(reactAct)
export const waitForHookUpdates = waitForReactUpdatesFactory(hooksAct)
