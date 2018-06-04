import * as React from 'react'

import { IPageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components/Header'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog
} from 'Util/ITIReact'

interface IErrorDialogProps extends React.Props<any> {
    onClose(): void
    onError(e: any): void
}

class ErrorDialog extends React.Component<IErrorDialogProps> {
    componentDidMount() {
        this.props.onError('Test error.')
    }

    render() {
        const { onClose } = this.props

        return (
            <ActionDialog
                id="error-dialog"
                title="Dialog Error Test"
                onClose={onClose}
                loading={false}
                action={() => {}}
                actionButtonText="Test"
            />
        )
    }
}

interface IPageState {
    submitting: boolean
    page: number
    totalPages: number

    actionDialogArgs?: {}
    standaloneConfirmDialogArgs?: {}
    errorDialogArgs?: {}
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
            pageId: 'page-home-components'
        })
    }

    submit = () => {
        this.setState({ submitting: true })

        this.submittingTimer = setTimeout(() => {
            this.setState({ submitting: false })
        }, 2000)
    }

    confirmOptions = {
        confirmation: 'Are you sure you want to do that?',
        actionButtonText: 'Do it!',
        actionButtonClass: 'btn-danger'
    }

    confirmationAlert = (confirmed: boolean) => {
        if (confirmed) {
            alert('Performed the action!')
        } else {
            alert('Did not perform the action.')
        }
    }

    doConfirm = async () => {
        try {
            const confirmOptions = this.confirmOptions

            await confirm(confirmOptions.confirmation, {
                actionButtonText: confirmOptions.actionButtonText,
                actionButtonClass: confirmOptions.actionButtonClass
            })
        } catch {
            // user cancelled
            this.confirmationAlert(true)
            return
        }

        this.confirmationAlert(false)
    }

    getDialog = () => {
        const { onError } = this.props
        const {
            actionDialogArgs,
            standaloneConfirmDialogArgs,
            errorDialogArgs
        } = this.state

        if (actionDialogArgs) {
            return (
                <ActionDialog
                    id="my-dialog"
                    title="Action Dialog"
                    actionButtonText="OK"
                    loading={false}
                    action={() =>
                        this.setState({ actionDialogArgs: undefined })
                    }
                    onClose={() =>
                        this.setState({ actionDialogArgs: undefined })
                    }
                >
                    Content goes here.
                </ActionDialog>
            )
        }

        if (standaloneConfirmDialogArgs) {
            const confirmOptions = this.confirmOptions

            const func = (confirmed: boolean) => {
                return () => {
                    this.setState({ standaloneConfirmDialogArgs: undefined })

                    // since proceed is called before the dialog closes
                    const timeout = confirmed ? 250 : 0

                    setTimeout(() => this.confirmationAlert(confirmed), timeout)
                }
            }

            return (
                <ConfirmDialog
                    confirmation={confirmOptions.confirmation}
                    actionButtonText={confirmOptions.actionButtonText}
                    actionButtonClass={confirmOptions.actionButtonClass}
                    proceed={func(true)}
                    cancel={func(false)}
                />
            )
        }

        if (errorDialogArgs) {
            return (
                <ErrorDialog
                    onError={onError}
                    onClose={() =>
                        this.setState({ errorDialogArgs: undefined })
                    }
                />
            )
        }

        return undefined
    }

    render() {
        if (!this.props.ready) return null

        const { submitting, page, totalPages } = this.state

        return (
            <div>
                {this.getDialog()}
                <div className="card mb-4">
                    <div className="card-body">
                        <p>
                            Click the submit button / link to make it spin for 2
                            seconds.
                        </p>
                        <SubmitButton
                            className="btn btn-primary"
                            submitting={submitting}
                            onClick={this.submit}
                        >
                            Submit
                        </SubmitButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <SubmitButton
                            element="a"
                            submitting={submitting}
                            onClick={this.submit}
                        >
                            Submit
                        </SubmitButton>
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="form-group">
                            <label>Total pages</label>
                            <input
                                className="form-control"
                                style={{ width: '100px' }}
                                value={totalPages.toString()}
                                onChange={e => {
                                    const v = e.currentTarget.value
                                    this.setState({
                                        totalPages: !isNaN(parseInt(v))
                                            ? parseInt(v)
                                            : 0
                                    })
                                }}
                            />
                        </div>
                        <Pager
                            page={page}
                            totalPages={totalPages}
                            onPageChange={page => this.setState({ page })}
                        />
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                                this.setState({ actionDialogArgs: {} })
                            }
                        >
                            Action dialog
                        </button>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={this.doConfirm}
                        >
                            Confirm dialog
                        </button>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                                this.setState({
                                    standaloneConfirmDialogArgs: {}
                                })
                            }
                        >
                            Standalone confirm dialog
                        </button>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() =>
                                this.setState({
                                    errorDialogArgs: {}
                                })
                            }
                            title="This is to test that the modal gets fully removed if it hits an error in componentDidMount()."
                        >
                            Dialog error test
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.submittingTimer) clearTimeout(this.submittingTimer)
    }
}
