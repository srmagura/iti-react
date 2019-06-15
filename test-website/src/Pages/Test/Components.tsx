import * as React from 'react'

import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog,
    getGuid,
    AddressDisplay,
    FormCheck,
    alert
} from '@interface-technologies/iti-react'

interface ErrorDialogProps {
    onClose(): void
    onError(e: any): void
}

class ErrorDialog extends React.Component<ErrorDialogProps> {
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
                actionInProgress={false}
                action={() => {}}
                actionButtonText="Test"
            />
        )
    }
}

interface MyActionDialogProps {
    onClose(): void
}

interface MyActionDialogState {
    actionInProgress: boolean
    showFooter: boolean
    useOnCancel: boolean
}

class MyActionDialog extends React.Component<MyActionDialogProps, MyActionDialogState> {
    state: MyActionDialogState = {
        actionInProgress: false,
        showFooter: true,
        useOnCancel: false
    }
    readonly id = getGuid()

    render() {
        const { onClose } = this.props
        const { actionInProgress, showFooter, useOnCancel } = this.state

        return (
            <ActionDialog
                id="my-action-dialog"
                title="Action Dialog"
                actionButtonText="OK"
                actionInProgress={actionInProgress}
                action={onClose}
                showFooter={showFooter}
                onClose={onClose}
                onCancel={
                    useOnCancel
                        ? () => window.alert('Cancel button was clicked!')
                        : undefined
                }
            >
                <p>
                    Content goes here. Escape should close the dialog only when
                    actionInProgress=false.
                </p>
                <FormCheck
                    label="Action in progress"
                    checked={actionInProgress}
                    onChange={() =>
                        this.setState(s => ({
                            ...s,
                            actionInProgress: !s.actionInProgress
                        }))
                    }
                    inline={false}
                />
                <FormCheck
                    label="Show footer"
                    checked={showFooter}
                    onChange={() =>
                        this.setState(s => ({
                            ...s,
                            showFooter: !s.showFooter
                        }))
                    }
                    inline={false}
                />
                <FormCheck
                    label="Use onCancel"
                    checked={useOnCancel}
                    onChange={() =>
                        this.setState(s => ({
                            ...s,
                            useOnCancel: !s.useOnCancel
                        }))
                    }
                    inline={false}
                />
            </ActionDialog>
        )
    }
}

interface PageState {
    submitting: boolean
    page: number
    totalPages: number
    pagerEnabled: boolean

    actionDialogArgs?: {}
    standaloneConfirmDialogArgs?: {}
    errorDialogArgs?: {}
}

export class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        submitting: false,
        page: 1,
        totalPages: 10,
        pagerEnabled: true
    }

    submittingTimer?: number

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Component test',
            activeNavbarLink: NavbarLink.Index,
        })
    }

    submit = () => {
        this.setState({ submitting: true })

        this.submittingTimer = window.setTimeout(() => {
            this.setState({ submitting: false })
        }, 2000)
    }

    doAlert = async () => {
        await alert(
            <div>
                Consider yourself <b>alerted!!!</b>
            </div>,
            { title: 'Custom Alert' }
        )
        console.log('alert() promise resolved')
        await alert(<div>Default title</div>, { title: undefined })
        await alert('No options supplied')
    }

    confirmOptions = {
        confirmation: 'Are you sure you want to do that?',
        actionButtonText: 'Do it!',
        actionButtonClass: 'btn-danger'
    }

    confirmationAlert = (confirmed: boolean) => {
        if (confirmed) {
            window.alert('Performed the action!')
        } else {
            window.alert('Did not perform the action.')
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
            this.confirmationAlert(false)
            return
        }

        this.confirmationAlert(true)
    }

    doConfirmJsx = async () => {
        try {
            const confirmOptions = this.confirmOptions

            await confirm(
                <span>
                    Passing a <b>JSX</b> element to confirm.
                </span>,
                {
                    actionButtonText: confirmOptions.actionButtonText,
                    actionButtonClass: confirmOptions.actionButtonClass,
                    title: 'MY CUSTOM TITLE',
                    cancelButtonText: 'MY CUSTOM CANCEL'
                }
            )
        } catch {
            // user cancelled
            this.confirmationAlert(false)
            return
        }

        this.confirmationAlert(true)
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
                <MyActionDialog
                    onClose={() => this.setState({ actionDialogArgs: undefined })}
                />
            )
        }

        if (standaloneConfirmDialogArgs) {
            const confirmOptions = this.confirmOptions

            const func = (confirmed: boolean) => {
                return () => {
                    this.setState({ standaloneConfirmDialogArgs: undefined })

                    // since proceed is called before the dialog closes
                    const timeout = confirmed ? 250 : 0

                    window.setTimeout(() => this.confirmationAlert(confirmed), timeout)
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
                    onClose={() => this.setState({ errorDialogArgs: undefined })}
                />
            )
        }

        return undefined
    }

    render() {
        if (!this.props.ready) return null

        const { submitting, page, totalPages, pagerEnabled } = this.state

        return (
            <div>
                {this.getDialog()}
                <div className="card mb-4">
                    <div className="card-body">
                        <p>
                            Click the submit button / link to make it spin for 2 seconds.
                            Hover over the first button to see a tooltip.
                        </p>
                        <SubmitButton
                            className="btn btn-primary mr-3"
                            submitting={submitting}
                            onClick={this.submit}
                            data-tooltip="Click here"
                        >
                            Submit
                        </SubmitButton>
                        <SubmitButton
                            className="mr-5"
                            element="a"
                            submitting={submitting}
                            onClick={this.submit}
                        >
                            Submit
                        </SubmitButton>
                        <SubmitButton
                            className="btn btn-primary mr-3"
                            submitting={false}
                            enabled={false}
                        >
                            Disabled
                        </SubmitButton>
                        <SubmitButton element="a" submitting={false} enabled={false}>
                            Disabled
                        </SubmitButton>
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="d-flex">
                            <div className="form-group mr-4">
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
                            <div className="form-group">
                                <label className="d-block">&nbsp;</label>
                                <div className="form-check form-check-inline pt-2">
                                    <input
                                        id="pager-enabled-checkbox"
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={pagerEnabled}
                                        onChange={() => {
                                            this.setState({
                                                pagerEnabled: !pagerEnabled
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor="pager-enabled-checkbox"
                                        className="form-check-label"
                                    >
                                        Pager enabled
                                    </label>
                                </div>
                            </div>
                        </div>
                        <Pager
                            page={page}
                            totalPages={totalPages}
                            onPageChange={page => this.setState({ page })}
                            enabled={pagerEnabled}
                        />
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() => this.setState({ actionDialogArgs: {} })}
                        >
                            Action dialog
                        </button>
                        <button className="btn btn-secondary mr-2" onClick={this.doAlert}>
                            Alert dialog
                        </button>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={this.doConfirm}
                        >
                            Confirm dialog
                        </button>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={this.doConfirmJsx}
                        >
                            Confirm dialog (JSX)
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
                            className="btn btn-danger mr-2"
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
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Address Display</h5>
                        <div className="d-flex">
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    city: 'Raleigh',
                                    state: 'NC',
                                    zip: '27609'
                                }}
                            />
                            <div className="mr-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    line2: 'Office 453',
                                    city: 'Raleigh',
                                    state: 'NC',
                                    zip: '276095959'
                                }}
                            />
                            <div className="mr-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    city: 'Toronto',
                                    state: 'ON',
                                    zip: 'A1A1A1'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.submittingTimer) window.clearTimeout(this.submittingTimer)
    }
}
