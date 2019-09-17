﻿import * as React from 'react'
import { useState, useRef } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    SubmitButton,
    Pager,
    ActionDialog,
    confirm,
    ConfirmDialog,
    AddressDisplay,
    FormCheck,
    alert,
    SavedMessage,
    LinkButton
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

function MyActionDialog(props: MyActionDialogProps) {
    const { onClose } = props

    const [actionInProgress, setActionInProgress] = useState(false)
    const [showFooter, setShowFooter] = useState(true)
    const [provideOnCancel, setProvideOnCancel] = useState(false)

    const closeRef = useRef(() => {})

    return (
        <ActionDialog
            title="Action Dialog"
            actionButtonText="OK"
            actionInProgress={actionInProgress}
            action={onClose}
            showFooter={showFooter}
            onClose={onClose}
            onCancel={
                provideOnCancel
                    ? () => window.alert('Cancel button was clicked!')
                    : undefined
            }
            closeRef={closeRef}
        >
            <p>
                Content goes here. Escape should close the dialog only when
                actionInProgress=false.
            </p>
            <FormCheck
                label="Action in progress"
                checked={actionInProgress}
                onChange={() => setActionInProgress(b => !b)}
                inline={false}
            />
            <FormCheck
                label="Show footer"
                checked={showFooter}
                onChange={() => setShowFooter(b => !b)}
                inline={false}
            />
            <FormCheck
                label="Show alert when cancel button clicked"
                checked={provideOnCancel}
                onChange={() => setProvideOnCancel(b => !b)}
                inline={false}
            />
            <br />
            <button
                className="btn btn-secondary btn-sm"
                onClick={() => closeRef.current()}
            >
                Close dialog via closeRef
            </button>
        </ActionDialog>
    )
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
    showSavedMessageRef: React.MutableRefObject<() => void> = { current: () => {} }

    componentDidMount() {
        const { onReady } = this.props

        onReady({
            title: 'Component test',
            activeNavbarLink: NavbarLink.Index
        })
    }

    submit = () => {
        this.setState({ submitting: true })

        this.submittingTimer = window.setTimeout(() => {
            this.setState({ submitting: false })
            this.showSavedMessageRef.current()
        }, 2000)
    }

    doAlert = async () => {
        await alert(
            <div>
                Consider yourself <b>alerted!!!</b>
            </div>,
            { title: 'Custom Alert' }
        )

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
                        <div className="d-flex align-items-baseline">
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
                            <SavedMessage
                                showSavedMessageRef={this.showSavedMessageRef}
                                className="saved-message-ml"
                            />
                        </div>
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
                                    postalCode: '27609'
                                }}
                            />
                            <div className="mr-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    line2: 'Office 453',
                                    city: 'Raleigh',
                                    state: 'NC',
                                    postalCode: '276095959'
                                }}
                            />
                            <div className="mr-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    city: 'Toronto',
                                    state: 'ON',
                                    postalCode: 'A1A1A1'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Link Button</h5>
                        <LinkButton
                            onClick={() => alert('You clicked the link button.')}
                            className="mr-5"
                        >
                            Click me
                        </LinkButton>
                        <LinkButton
                            onClick={() => alert('You clicked the link button.')}
                            style={{ backgroundColor: 'lemonchiffon' }}
                            aria-label="Click me"
                        >
                            Link button with pass-through props
                        </LinkButton>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.submittingTimer) window.clearTimeout(this.submittingTimer)
    }
}
