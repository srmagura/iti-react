import {
    Breadcrumbs,
    FormGroup,
    SubmitButton,
    useFieldValidity,
    ValidatedInput,
    Validators,
} from '@interface-technologies/iti-react'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions, selectLogInRequestStatus } from '_Redux'
import { useCurrentUser } from 'hooks'
import { ErrorType } from '_util/errorHandling'
import { useReady } from 'Components/Routing'
import { useNavigate } from 'react-router-dom'
import { FormError } from 'Components'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { onChildValidChange, allFieldsValid } = useFieldValidity()
    const [showValidation, setShowValidation] = useState(false)
    const vProps = { showValidation, onValidChange: onChildValidChange }

    useEffect(() => {
        onReady({
            title: 'Log In',
            activeNavbarLink: undefined,
        })
    }, [onReady])

    const hasRedirectedRef = useRef(false)
    const { isLoading: isLoadingUser, isSuccess: hasLoadedUser } = useCurrentUser()

    useEffect(() => {
        if (hasLoadedUser && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            navigate('/')
        }
    }, [hasLoadedUser, navigate])

    const logInRequestStatus = useSelector(selectLogInRequestStatus)
    const loggingIn = logInRequestStatus.inProgress || isLoadingUser

    function submit(e: React.SyntheticEvent<HTMLFormElement>): void {
        e.preventDefault()

        setShowValidation(true)
        if (!allFieldsValid) return

        dispatch(
            authActions.logInAsync.request({
                email,
                password,
                rememberMe: true,
            })
        )
    }

    return (
        <div hidden={!ready}>
            <Breadcrumbs />
            <div
                style={{
                    margin: '0 auto',
                    maxWidth: 400,
                }}
            >
                <div className="heading-row">
                    <h1>Log In</h1>
                </div>
                {logInRequestStatus.error?.type === ErrorType.BadRequest && (
                    <FormError>Login failed. Please try again.</FormError>
                )}
                <form onSubmit={submit} noValidate>
                    <FormGroup label="Email address" className="mb-4">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="email"
                                type="email"
                                value={email}
                                onChange={setEmail}
                                validators={[Validators.required(), Validators.email()]}
                                {...vProps}
                            />
                        )}
                    </FormGroup>
                    <FormGroup label="Password" className="mb-4">
                        {(id) => (
                            <ValidatedInput
                                id={id}
                                name="password"
                                type="password"
                                value={password}
                                onChange={setPassword}
                                validators={[Validators.required()]}
                                {...vProps}
                            />
                        )}
                    </FormGroup>
                    <SubmitButton
                        className="btn btn-primary w-100"
                        type="submit"
                        submitting={loggingIn}
                    >
                        Log in
                    </SubmitButton>
                </form>
            </div>
        </div>
    )
}
