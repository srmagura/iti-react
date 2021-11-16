import React from 'react'
import { ErrorRouteSynchronizer } from '@interface-technologies/iti-react'
import { useSelector } from 'react-redux'
import { errorSelector } from '_Redux'
import { UrlParamName } from 'Components/Constants'

interface MyErrorRouteSynchronizerProps {}

export function MyErrorRouteSynchronizer(props: MyErrorRouteSynchronizerProps) {
    return (
        <ErrorRouteSynchronizer
            error={useSelector(errorSelector)}
            errorUrlParamName={UrlParamName.Error}
        />
    )
}
