import React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import { formatUrlParams } from '@interface-technologies/iti-react'

interface PageState {
    loading: boolean
}

/* This is to test that the page titles update correctly when a page pushes to history
 * in componentDidMount(), like a log out page would. */
export class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        loading: true
    }

    timer?: number

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'URL Search Param Test',
            activeNavbarLink: NavbarLink.Index
        })

        this.timer = window.setTimeout(() => this.setState({ loading: false }), 1500)
    }

    get myParam() {
        const params = new URLSearchParams(this.props.location.search)
        return params.get('myParam')
    }

    addDigit = () => {
        const digit = Math.random()
            .toString()
            .charAt(3)
        const newPath =
            this.props.location.pathname +
            formatUrlParams({ myParam: this.myParam + digit })

        this.props.history.push(newPath)
    }

    render() {
        if (!this.props.ready) return null

        if (this.state.loading) {
            return (
                <div style={{ fontSize: '1.5rem', padding: '0.5rem 2rem' }}>
                    <i className="fa fa-spinner fa-spin" />
                </div>
            )
        }

        return (
            <div>
                <h5 className="mb-3">Current param value: {this.myParam}</h5>
                <p>
                    <button className="btn btn-primary" onClick={this.addDigit}>
                        Add a digit to param value
                    </button>
                </p>
                <p>
                    Should cause page to remount because location key will changed - see
                    MyAsyncRouter.getLocationKey().
                </p>
            </div>
        )
    }

    componentWillUnmount() {
        window.clearTimeout(this.timer)
    }
}
