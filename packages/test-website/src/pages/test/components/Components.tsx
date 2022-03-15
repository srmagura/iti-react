/* eslint-disable no-alert */
import { ReactElement, useEffect, useState, useRef } from 'react'
import { NavbarLink } from 'components'
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
    EasyFormPopoverManager,
} from '@interface-technologies/iti-react'
import Tippy from '@tippyjs/react'
import { useReady } from 'components/routing'
import { useOnError } from 'hooks'
import { Link } from 'react-router-dom'
import { PagerSection } from './PagerSection'
import { TestEasyFormDialog } from './TestEasyFormDialog'
import { TestEasyFormPopover } from './TestEasyFormPopover'

function ErrorDialog(): ReactElement {
    const onError = useOnError()

    useEffect(() => {
        onError(new Error('TEST ERROR'))
    }, [onError])

    return (
        <ActionDialog
            title="Dialog Error Test"
            onClose={() => {}}
            actionInProgress={false}
            action={() => {}}
            actionButtonText="Test"
        />
    )
}

interface MyActionDialogProps {
    onClose(): void
}

function MyActionDialog({ onClose }: MyActionDialogProps): ReactElement {
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
            <p>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => closeRef.current()}
                    type="button"
                >
                    Close dialog via closeRef
                </button>
            </p>
            <Link to="/">A link to another page</Link>
        </ActionDialog>
    )
}

export default function Page(): ReactElement {
    const { onReady } = useReady()

    useEffect(() => {
        onReady({
            title: 'Component test',
            activeNavbarLink: NavbarLink.Index,
        })
    }, [onReady])

    const [submitting, setSubmitting] = useState(false)
    const submittingTimerRef = useRef<number>()
    const showSavedMessageRef = useRef(() => {})

    function submit(): void {
        setSubmitting(true)

        submittingTimerRef.current = window.setTimeout(() => {
            setSubmitting(false)
            showSavedMessageRef.current()
        }, 2000)
    }

    async function doAlert(): Promise<void> {
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

    const defaultConfirmation = 'Are you sure you want to do that?'
    const defaultConfirmOptions = {
        actionButtonText: 'Do it!',
        actionButtonClass: 'btn-danger',
    }

    function confirmationAlert(confirmed: boolean): void {
        if (confirmed) {
            window.alert('Performed the action!')
        } else {
            window.alert('Did not perform the action.')
        }
    }

    async function doConfirm(): Promise<void> {
        try {
            await confirm(defaultConfirmation, defaultConfirmOptions)
        } catch {
            // user cancelled
            confirmationAlert(false)
            return
        }

        confirmationAlert(true)
    }

    async function doConfirmJsx(): Promise<void> {
        try {
            await confirm(
                <span>
                    Passing a <b>JSX</b> element to confirm.
                </span>,
                {
                    ...defaultConfirmOptions,
                    title: 'MY CUSTOM TITLE',
                    cancelButtonText: 'MY CUSTOM CANCEL',
                }
            )
        } catch {
            // user cancelled
            confirmationAlert(false)
            return
        }

        confirmationAlert(true)
    }

    const [actionDialogVisible, setActionDialogVisible] = useState(false)
    const [standaloneConfirmDialogVisible, setStandaloneConfirmDialogVisible] =
        useState(false)
    const [testEasyFormDialogVisible, setTestEasyFormDialogVisible] = useState(false)
    const [errorDialogVisible, setErrorDialogVisible] = useState(false)
    const [testEasyFormPopoverVisible, setTestEasyFormPopoverVisible] = useState(false)

    const standaloneConfirmDialogCloseRef = useRef(() => {})
    const testEasyFormDialogResponseDataRef = useRef<number>()
    const testEasyFormPopoverResponseDataRef = useRef<number>()

    function renderDialog(): ReactElement | null {
        if (testEasyFormDialogVisible) {
            return (
                <TestEasyFormDialog
                    onSuccess={(responseData) => {
                        testEasyFormDialogResponseDataRef.current = responseData
                        return Promise.resolve()
                    }}
                    onClose={() => {
                        setTestEasyFormDialogVisible(false)

                        if (
                            typeof testEasyFormDialogResponseDataRef.current !==
                            'undefined'
                        ) {
                            void alert(
                                `TestEasyFormDialog response data: ${testEasyFormDialogResponseDataRef.current}`
                            )
                            testEasyFormDialogResponseDataRef.current = undefined
                        }
                    }}
                />
            )
        }

        if (actionDialogVisible) {
            return <MyActionDialog onClose={() => setActionDialogVisible(false)} />
        }

        if (standaloneConfirmDialogVisible) {
            return (
                <ConfirmDialog
                    confirmation={defaultConfirmation}
                    actionButtonText={defaultConfirmOptions.actionButtonText}
                    actionButtonClass={defaultConfirmOptions.actionButtonClass}
                    closeRef={standaloneConfirmDialogCloseRef}
                    proceed={() => {
                        window.setTimeout(() => confirmationAlert(true), 250)
                        standaloneConfirmDialogCloseRef.current()
                    }}
                    cancel={() => {
                        setStandaloneConfirmDialogVisible(false)
                        confirmationAlert(false)
                    }}
                />
            )
        }

        if (errorDialogVisible) {
            return <ErrorDialog />
        }

        return null
    }

    return (
        <div className="page-test-components">
            {renderDialog()}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">SubmitButton</h5>
                    <p>
                        Click the submit button / link to make it spin for 2 seconds.
                        Hover over the first button to see a tooltip.
                    </p>
                    <div className="d-flex align-items-baseline justify-content-between">
                        <div className="d-flex align-items-baseline">
                            <Tippy content="Click here">
                                <div className="me-3">
                                    <SubmitButton
                                        className="btn btn-primary"
                                        submitting={submitting}
                                        onClick={submit}
                                    >
                                        Submit
                                    </SubmitButton>
                                </div>
                            </Tippy>
                            <SubmitButton
                                className="me-5"
                                element="a"
                                submitting={submitting}
                                onClick={submit}
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
                            <SubmitButton element="a" submitting={false} enabled={false}>
                                Disabled
                            </SubmitButton>
                            <SavedMessage
                                showSavedMessageRef={showSavedMessageRef}
                                className="saved-message-ms"
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
                    <h5 className="card-title">Dialogs</h5>
                    <div className="dialog-buttons">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setTestEasyFormDialogVisible(true)}
                            type="button"
                        >
                            Easy form dialog
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setActionDialogVisible(true)}
                            type="button"
                        >
                            Action dialog
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => void doAlert()}
                            type="button"
                        >
                            Alert dialog
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => void doConfirm()}
                            type="button"
                        >
                            Confirm dialog
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => void doConfirmJsx()}
                            type="button"
                        >
                            Confirm dialog (JSX)
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStandaloneConfirmDialogVisible(true)}
                            type="button"
                        >
                            Standalone confirm dialog
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => setErrorDialogVisible(true)}
                            type="button"
                        >
                            Error dialog
                        </button>
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Popovers</h5>
                    <div className="dialog-buttons">
                        <EasyFormPopoverManager
                            popoverVisible={testEasyFormPopoverVisible}
                            onPopoverVisibleChange={(b) => {
                                setTestEasyFormPopoverVisible(b)
                                testEasyFormPopoverResponseDataRef.current = undefined
                            }}
                            renderReferenceElement={({ setRef, onClick }) => (
                                <button
                                    ref={setRef}
                                    onClick={onClick}
                                    className="btn btn-secondary"
                                    type="button"
                                >
                                    Easy form popover
                                </button>
                            )}
                        >
                            <TestEasyFormPopover
                                onSuccess={(responseData) => {
                                    testEasyFormPopoverResponseDataRef.current =
                                        responseData
                                    return Promise.resolve()
                                }}
                                onClose={() => {
                                    setTestEasyFormPopoverVisible(false)

                                    if (testEasyFormPopoverResponseDataRef.current) {
                                        void alert(
                                            `The response data is ${testEasyFormPopoverResponseDataRef.current}.`
                                        )
                                    }
                                }}
                            />
                        </EasyFormPopoverManager>
                    </div>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">AddressDisplay</h5>
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
                    <h5 className="card-title">LinkButton</h5>
                    <LinkButton
                        onClick={() => void alert('You clicked the link button.')}
                        className="me-5"
                    >
                        Click me
                    </LinkButton>
                    <LinkButton
                        onClick={(e) => {
                            e.stopPropagation()
                            void alert('You clicked the link button.')
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
                    <h5 className="card-title">ClickToCopy</h5>
                    ID: 123456789
                    <ClickToCopy text="123456789" className="px-2" />
                </div>
            </div>
        </div>
    )
}
