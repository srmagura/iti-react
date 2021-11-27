import { ErrorRouteSynchronizer } from '@interface-technologies/iti-react'
import { useSelector } from 'react-redux'
import { selectError } from '_Redux'
import { UrlParamName } from 'Components/Constants'
import { ReactElement } from 'react'

export function MyErrorRouteSynchronizer(): ReactElement {
    return (
        <ErrorRouteSynchronizer
            error={useSelector(selectError)}
            errorUrlParamName={UrlParamName.Error}
        />
    )
}
