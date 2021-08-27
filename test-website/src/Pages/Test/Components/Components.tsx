import React from 'react'
import { useState, useRef } from 'react'
import { PageProps } from 'Components/Routing/RouteProps'
import { NavbarLink } from 'Components'
import {
    SubmitButton,
    ActionDialog,
    confirm,
    ConfirmDialog,
    AddressDisplay,
    FormCheck,
    alert,
    SavedMessage,
    LinkButton,
    ClickToCopy,
} from '@interface-technologies/iti-react'
import { forceUpdateTooltips } from 'Components/Layout'
import { TestEasyFormDialog } from './TestEasyFormDialog'
import { PagerSection } from './PagerSection'

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
            action={() => {
                closeRef.current()
            }}
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
                onChange={() => setActionInProgress((b) => !b)}
                inline={false}
            />
            <FormCheck
                label="Show footer"
                checked={showFooter}
                onChange={() => setShowFooter((b) => !b)}
                inline={false}
            />
            <FormCheck
                label="Show alert when cancel button clicked"
                checked={provideOnCancel}
                onChange={() => setProvideOnCancel((b) => !b)}
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

    actionDialogArgs?: {}
    standaloneConfirmDialogArgs?: {}
    errorDialogArgs?: {}
    testEasyFormDialogVisible: boolean
}

export default class Page extends React.Component<PageProps, PageState> {
    state: PageState = {
        submitting: false,
        testEasyFormDialogVisible: false,
    }

    submittingTimer?: number
    showSavedMessageRef: React.MutableRefObject<() => void> = { current: () => {} }
    testEasyFormDialogResponseData: number | undefined

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

        await alert(<div>Default title, large</div>, {
            title: undefined,
            modalClass: 'modal-lg',
        })
        await alert('No options supplied')
    }

    confirmOptions = {
        confirmation: 'Are you sure you want to do that?',
        actionButtonText: 'Do it!',
        actionButtonClass: 'btn-danger',
        //modalClass: 'modal-lg'
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
            const { confirmation, ...confirmOptions } = this.confirmOptions

            await confirm(confirmation, confirmOptions)
        } catch {
            // user cancelled
            this.confirmationAlert(false)
            return
        }

        this.confirmationAlert(true)
    }

    doConfirmJsx = async () => {
        try {
            const { confirmation: _, ...confirmOptions } = this.confirmOptions

            await confirm(
                <span>
                    Passing a <b>JSX</b> element to confirm.
                </span>,
                {
                    ...confirmOptions,
                    title: 'MY CUSTOM TITLE',
                    cancelButtonText: 'MY CUSTOM CANCEL',
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
            errorDialogArgs,
            testEasyFormDialogVisible,
        } = this.state

        if (testEasyFormDialogVisible) {
            return (
                <TestEasyFormDialog
                    onSuccess={(responseData) => {
                        this.testEasyFormDialogResponseData = responseData
                        return Promise.resolve()
                    }}
                    onClose={() => {
                        this.setState({ testEasyFormDialogVisible: false })

                        if (typeof this.testEasyFormDialogResponseData !== 'undefined') {
                            alert(
                                'TestEasyFormDialog response data: ' +
                                    this.testEasyFormDialogResponseData
                            )
                            this.testEasyFormDialogResponseData = undefined
                        }
                    }}
                />
            )
        }

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

        const { submitting } = this.state

        return (
            <div className="page-test-components">
                {this.getDialog()}
                <div className="card mb-4">
                    <div className="card-body">
                        <p>
                            Click the submit button / link to make it spin for 2 seconds.
                            Hover over the first button to see a tooltip.
                        </p>
                        <div className="d-flex align-items-baseline justify-content-between">
                            <div className="d-flex align-items-baseline">
                                <SubmitButton
                                    className="btn btn-primary me-3"
                                    submitting={submitting}
                                    onClick={this.submit}
                                    data-tooltip="Click here"
                                >
                                    Submit
                                </SubmitButton>
                                <SubmitButton
                                    className="me-5"
                                    element="a"
                                    submitting={submitting}
                                    onClick={this.submit}
                                >
                                    Submit
                                </SubmitButton>
                                <SubmitButton
                                    className="btn btn-primary me-3"
                                    submitting={false}
                                    enabled={false}
                                >
                                    Disabled
                                </SubmitButton>
                                <SubmitButton
                                    element="a"
                                    submitting={false}
                                    enabled={false}
                                >
                                    Disabled
                                </SubmitButton>
                                <SavedMessage
                                    showSavedMessageRef={this.showSavedMessageRef}
                                    className="saved-message-ml"
                                />
                            </div>
                            <SubmitButton
                                element="a"
                                submitting={false}
                                enabled={false}
                                className="text-danger"
                            >
                                Disabled with .text-danger
                            </SubmitButton>
                        </div>
                    </div>
                </div>
                <PagerSection />
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="dialog-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={() =>
                                    this.setState({ testEasyFormDialogVisible: true })
                                }
                            >
                                Easy form dialog
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => this.setState({ actionDialogArgs: {} })}
                            >
                                Action dialog
                            </button>
                            <button className="btn btn-secondary" onClick={this.doAlert}>
                                Alert dialog
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={this.doConfirm}
                            >
                                Confirm dialog
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={this.doConfirmJsx}
                            >
                                Confirm dialog (JSX)
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() =>
                                    this.setState({
                                        standaloneConfirmDialogArgs: {},
                                    })
                                }
                            >
                                Standalone confirm dialog
                            </button>
                        </div>
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
                                    postalCode: '27609',
                                }}
                            />
                            <div className="me-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    line2: 'Office 453',
                                    city: 'Raleigh',
                                    state: 'NC',
                                    postalCode: '276095959',
                                }}
                            />
                            <div className="me-5" />
                            <AddressDisplay
                                address={{
                                    line1: '4116 Redington Dr',
                                    city: 'Toronto',
                                    state: 'ON',
                                    postalCode: 'A1A1A1',
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
                            className="me-5"
                        >
                            Click me
                        </LinkButton>
                        <LinkButton
                            onClick={(e) => {
                                e.stopPropagation()
                                alert('You clicked the link button.')
                            }}
                            style={{ backgroundColor: 'lemonchiffon' }}
                            aria-label="Click me"
                        >
                            Link button with pass-through props
                        </LinkButton>
                    </div>
                </div>
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Click to Copy</h5>
                        ID: 123456789
                        <ClickToCopy
                            text="123456789"
                            className="p-2"
                            forceUpdateTooltips={forceUpdateTooltips}
                        />
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.submittingTimer) window.clearTimeout(this.submittingTimer)
    }
}
