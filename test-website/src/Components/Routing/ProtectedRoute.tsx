import * as React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'
import { Location } from 'history'
import { NoWarnRedirect } from '@interface-technologies/iti-react'
import { AppState } from '_Redux'
import { connect } from 'react-redux'

interface ProtectedRouteProps {
    authenticated: boolean

    // Copied from @types/react-router
    location?: Location
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
    render?: ((props: RouteComponentProps<any>) => React.ReactNode)
    children?: ((props: RouteComponentProps<any>) => React.ReactNode) | React.ReactNode
    path?: string
    exact?: boolean
    strict?: boolean

    computedMatch: any
}

function _ProtectedRoute(props: ProtectedRouteProps) {
    const { authenticated, ...routeProps } = props

    if (authenticated) {
        return <Route {...routeProps} />
    } else {
        return <NoWarnRedirect to="/home/login" push={false} />
    }
}

function mapStateToProps(state: AppState) {
    return {
        authenticated: state.user !== null
    }
}

export const ProtectedRoute = connect(mapStateToProps)(_ProtectedRoute)

// Convenience functions

// computedMatch is injected by <Switch>
export function getProtectedRouteBuilder(location: Location, computedMatch: any) {
    return function protectedRoute(
        path: string,
        render: (props: RouteComponentProps<any>) => React.ReactNode
    ) {
        return (
            <ProtectedRoute
                exact
                path={path}
                render={render}
                location={location}
                computedMatch={computedMatch}
                key={path}
            />
        )
    }
}

export function getUnprotectedRouteBuilder(location: Location, computedMatch: any) {
    return function unprotectedRoute(
        path: string,
        render: (props: RouteComponentProps<any>) => React.ReactNode
    ) {
        return (
            <Route
                exact
                path={path}
                render={render}
                location={location}
                computedMatch={computedMatch}
                key={path}
            />
        )
    }
}
