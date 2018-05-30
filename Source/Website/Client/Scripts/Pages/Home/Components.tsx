import * as React from 'react';

import { IPageProps } from 'Components/Routing/RouteProps';
import { NavbarLink } from 'Components/Header';
import { SubmitButton, Pager, ActionDialog, confirm } from 'Util/ITIReact';

interface IPageState {
    submitting: boolean
    page: number
    totalPages: number
    dialogVisible: boolean
}

export class Page extends React.Component<IPageProps, IPageState> {

    state: IPageState = {
        submitting: false,
        page: 1,
        totalPages: 10,
        dialogVisible: false,
    }

    submittingTimer?: number

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Component test',
            activeNavbarLink: NavbarLink.Index,
            pageId: 'page-home-components'
        })
    }

    submit = () => {
        this.setState({ submitting: true })

        this.submittingTimer = setTimeout(() => {
            this.setState({ submitting: false })
        }, 2000)
    }

    doConfirm = async () => {
        try {
            await confirm('Are you sure you want to do that?',
                {
                    actionButtonText: 'Do it!',
                    actionButtonClass: 'btn-danger'
                })
        } catch {
            // user cancelled
            alert('Did not perform the action.')
            return
        }

        alert('Performed the action!')
    }

    getDialog = () => {
        const { dialogVisible } = this.state

        if (dialogVisible) {
            return <ActionDialog id="my-dialog"
                title="Action Dialog"
                actionButtonText="OK"
                loading={false}
                action={() => this.setState({ dialogVisible: false })}
                onClose={() => this.setState({ dialogVisible: false })}>
                Content goes here.
                </ActionDialog>
        }
    }

    render() {
        if (!this.props.ready) return null

        const { submitting, page, totalPages, dialogVisible } = this.state

        return <div>
            {this.getDialog()}
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
            <div className="card mb-4">
                <div className="card-body">
                    <button className="btn btn-secondary mr-2"
                        onClick={() => this.setState({ dialogVisible: true })}>
                        Action dialog
                        </button>
                    <button className="btn btn-secondary"
                        onClick={this.doConfirm}>
                        Confirm dialog
                        </button>
                </div>
            </div>
        </div>
    }

    componentWillUnmount() {
        if (this.submittingTimer)
            clearTimeout(this.submittingTimer)
    }
}


