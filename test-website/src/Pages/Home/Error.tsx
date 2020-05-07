import React from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { IError } from '_Redux'

interface ErrorPageProps extends PageProps {
    error?: IError
}

export default class Page extends React.Component<ErrorPageProps, {}> {
    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Error',
            activeNavbarLink: undefined,
        })
    }

    render() {
        if (!this.props.ready) return null

        const { error } = this.props
        if (!error) return null

        return (
            <div>
                <div className="alert alert-danger" role="alert">
                    {error.message}
                </div>
                <div className={(window as any).isDebug ? '' : 'invisible'}>
                    <h3>Diagnostic Information</h3>
                    <p>
                        <small>
                            Visible in debug, invisible but still present in the page for
                            other configurations.
                        </small>
                    </p>
                    {error.diagnosticInfo}
                </div>
            </div>
        )
    }
}
