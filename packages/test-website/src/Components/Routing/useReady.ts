import { useReadyCore } from '@interface-technologies/iti-react'
import { OnReadyArgs } from 'Components/Routing'

export function useReady() {
    return useReadyCore<OnReadyArgs>()
}
