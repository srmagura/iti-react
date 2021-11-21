import { ErrorRouteSynchronizer } from '@interface-technologies/iti-react'
import { useSelector } from 'react-redux'
import { errorSelector } from '_Redux'
import { UrlParamName } from 'Components/Constants'
import { ReactElement } from 'react'

export function MyErrorRouteSynchronizer(): ReactElement {
    return (
        <ErrorRouteSynchronizer
            error={useSelector(errorSelector)}
            errorUrlParamName={UrlParamName.Error}
        />
    )
}
