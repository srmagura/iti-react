import * as React from 'react'
import { ErrorDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import { Redirect } from 'react-router'

export class Page extends React.Component<PageProps, {}> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Error',
            activeNavbarLink: undefined,
            pageId: 'page-home-error'
        })
    }

    render() {
        if (!this.props.ready) return null

        const { error } = this.props

        if (!error) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <div className="alert alert-danger" role="alert">
                    {error.message}
                </div>
                <div className={(window as any).isDebug ? '' : 'invisible'}>
                    <h3>Diagnostic information</h3>
                    <p>
                        <small>
                            Visible in DEBUG, invisible but still present in the page for
                            other configurations.
                        </small>
                    </p>
                    {error.diagnosticInformation}
                </div>
            </div>
        )
    }
}
