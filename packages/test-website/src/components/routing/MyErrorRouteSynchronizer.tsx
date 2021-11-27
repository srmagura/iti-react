import { ErrorRouteSynchronizer } from '@interface-technologies/iti-react'
import { useSelector } from 'react-redux'
import { selectError } from '_redux'
import { UrlParamName } from '_constants'
import { ReactElement } from 'react'

export function MyErrorRouteSynchronizer(): ReactElement {
    return (
        <ErrorRouteSynchronizer
            error={useSelector(selectError)}
            errorUrlParamName={UrlParamName.Error}
        />
    )
}
