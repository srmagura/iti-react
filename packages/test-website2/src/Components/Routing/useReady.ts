import { ReadyContextData, useReadyCore } from '@interface-technologies/iti-react'
import { NavbarLink } from 'Components'

export interface OnReadyArgs {
    activeNavbarLink?: NavbarLink
    title: string
}

export function useReady(): ReadyContextData<OnReadyArgs> {
    return useReadyCore<OnReadyArgs>()
}
