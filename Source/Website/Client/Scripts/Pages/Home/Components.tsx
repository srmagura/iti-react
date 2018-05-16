import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { SubmitButton, Pager } from 'Util/ITIReact';

interface IPageState {
    submitting: boolean,
    page: number
    totalPages: number
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        submitting: false,
        page: 1,
        totalPages: 10
    }

    submittingTimer?: number

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Component test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-form'
        })
    }

    submit = () => {
        this.setState({ submitting: true })

        this.submittingTimer = setTimeout(() => {
            this.setState({ submitting: false })
        }, 2000)
    }

    render() {
        if (!this.props.ready) return null

        const { submitting, page, totalPages } = this.state

        return <div>
            <div className="card mb-4">
                <div className="card-body">
                    <p>
                        Click the submit button / link to make it spin for 2 seconds.
                </p>
                    <SubmitButton className="btn btn-primary"
                        submitting={submitting}
                        onClick={this.submit}>Submit</SubmitButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <SubmitButton element="a"
                        submitting={submitting}
                        onClick={this.submit}>Submit</SubmitButton>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <div className="form-group">
                        <label>Total pages</label>
                        <input className="form-control"
                            style={{ width: '100px' }}
                            value={totalPages.toString()}
                            onChange={e => {
                                const v = e.currentTarget.value
                                this.setState({ totalPages: !isNaN(parseInt(v)) ? parseInt(v) : 0 })
                            }} /></div>
                    <Pager
                        page={page}
                        totalPages={totalPages}
                        onPageChange={page => this.setState({ page })} />
                </div>
            </div>
        </div>
    }

    componentWillUnmount() {
        if (this.submittingTimer)
            clearTimeout(this.submittingTimer)
    }
}


