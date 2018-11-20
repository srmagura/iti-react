import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as invariant from 'invariant'
import { createLocation, locationsAreEqual, Location } from 'history'
import { generatePath } from 'react-router'

/* Copied from react-router 4.3.1 source.
 *
 * Changes:
 * - Removed warning when redirecting to the route you're currently on.
 *   Nothing bad happens why you try redirecting to the route you're currently on,
 *   it just prints an annoying warning and does nothing. It is difficult/impossible
 *   to prevent this warning when using AsyncRouter with Redirect.
 * - Remove componentWillMount, which is deprecated
 * - Ported to TypeScript (typing is still relatively weak)
 */

interface NoWarnRedirectProps {
    computedMatch?: any // private, from <Switch>
    push?: boolean
    from?: string
    to: string | Location
}

/**
 * The public API for updating the location programmatically
 * with a component.
 */
export class NoWarnRedirect extends React.Component<NoWarnRedirectProps> {
    static defaultProps = {
        push: false
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired
            }).isRequired,
            staticContext: PropTypes.object
        }).isRequired
    }

    isStatic() {
        return this.context.router && this.context.router.staticContext
    }

    componentDidMount() {
        invariant(this.context.router, 'You should not use <Redirect> outside a <Router>')

        if (!this.isStatic()) this.perform()
    }

    componentDidUpdate(prevProps: NoWarnRedirectProps) {
        const prevTo = createLocation(prevProps.to)
        const nextTo = createLocation(this.props.to)

        if (locationsAreEqual(prevTo, nextTo)) {
            return
        }

        this.perform()
    }

    computeTo({ computedMatch, to }: { computedMatch?: any; to: string | Location }) {
        if (computedMatch) {
            if (typeof to === 'string') {
                return generatePath(to, computedMatch.params)
            } else {
                return {
                    ...to,
                    pathname: generatePath(to.pathname, computedMatch.params)
                }
            }
        }

        return to
    }

    perform() {
        const { history } = this.context.router
        const { push } = this.props
        const to = this.computeTo({
            computedMatch: this.props.computedMatch,
            to: this.props.to
        })

        if (push) {
            history.push(to)
        } else {
            history.replace(to)
        }
    }

    render() {
        return null
    }
}
