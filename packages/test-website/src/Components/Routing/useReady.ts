import { useReadyCore } from '@interface-technologies/iti-react'
import { NavbarLink } from 'Components'

export interface OnReadyArgs {
    activeNavbarLink?: NavbarLink
    title: string
}

export function useReady() {
    return useReadyCore<OnReadyArgs>()
}
