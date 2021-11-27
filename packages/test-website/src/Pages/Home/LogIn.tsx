import React, { useState, useEffect, useRef, ReactElement } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    FormGroup,
    ValidatedInput,
    Validators,
    SubmitButton,
    FormCheck,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { selectUser, authActions, authSelectors } from '_Redux'
import { useNavigate } from 'react-router-dom'
import { useReady } from 'Components/Routing'
import { ErrorType } from '_util/errorHandling'

export default function Page(): ReactElement {
    const { ready, onReady } = useReady()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setrememberMe] = useState(true)

    const [showValidation] = useState(false)
    const { onChildValidChange } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    useEffect(() => {
        onReady({
            title: 'Log In',
        })
    }, [onReady])

    const user = useSelector(selectUser)
    const logInRequestStatus = useSelector(authSelectors.logInRequestStatus)
    const dispatch = useDispatch()

    const hasRedirectedRef = useRef(false)

    useEffect(() => {
        if (user && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            navigate('/')
            return
        }
    })

    function submit(e: React.SyntheticEvent<HTMLFormElement>): void {
        e.preventDefault()

        dispatch(
            authActions.logInAsync.request({
                email,
                password,
                rememberMe,
            })
        )
    }

    return (
        <div hidden={!ready}>
            <div className="heading-row">
                <h1>Log In</h1>
            </div>
            <form onSubmit={submit} className="form-limit-width" noValidate>
                {logInRequestStatus.error &&
                    logInRequestStatus.error.type === ErrorType.BadRequest && (
                        <p className="text-danger">Login failed. Please try again.</p>
                    )}
                <FormGroup label="Email address">
                    <ValidatedInput
                        name="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        validators={[Validators.required(), Validators.email()]}
                        {...vProps}
                    />
                </FormGroup>
                <FormGroup label="Password">
                    <ValidatedInput
                        name="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        validators={[Validators.required()]}
                        {...vProps}
                    />
                </FormGroup>
                <div className="form-group">
                    <FormCheck
                        name="rememberMe"
                        label="Keep me logged in"
                        checked={rememberMe}
                        onChange={() => setrememberMe((b) => !b)}
                    />{' '}
                </div>
                <SubmitButton
                    className="btn btn-primary"
                    type="submit"
                    submitting={logInRequestStatus.inProgress}
                >
                    Log in
                </SubmitButton>
            </form>
        </div>
    )
}
