﻿import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PageProps } from 'Components/Routing/RouteProps'
import {
    FormGroup,
    ValidatedInput,
    Validators,
    SubmitButton,
    FormCheck,
    useFieldValidity,
} from '@interface-technologies/iti-react'
import { userSelector, authActions, authSelectors } from '_Redux'
import { ErrorType } from '_Redux'
import { useHistory } from 'react-router-dom'

export default function Page({ ready, onReady }: PageProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [keepCookieAfterSessionEnds, setKeepCookieAfterSessionEnds] = useState(true)

    const [showValidation] = useState(false)
    const { onChildValidChange } = useFieldValidity()
    const vProps = { showValidation, onValidChange: onChildValidChange }

    useEffect(() => {
        onReady({
            title: 'Log In',
        })
    }, [])

    const user = useSelector(userSelector)
    const logInRequestStatus = useSelector(authSelectors.logInRequestStatus)
    const dispatch = useDispatch()

    const history = useHistory()
    const hasRedirectedRef = useRef(false)

    useEffect(() => {
        if (user && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            history.push('/')
            return
        }
    })

    async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()

        dispatch(
            authActions.logInAsync.request({
                email: { value: email },
                password,
                keepCookieAfterSessionEnds,
            })
        )
    }

    if (!ready) return null

    return (
        <div>
            <div className="heading-row">
                <h1>Log In</h1>
            </div>
            <form onSubmit={submit} className="form-limit-width" noValidate>
                {logInRequestStatus.error &&
                    logInRequestStatus.error.type === ErrorType.InvalidLogin && (
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
                        name="keepCookieAfterSessionEnds"
                        label="Keep me logged in"
                        checked={keepCookieAfterSessionEnds}
                        onChange={() => setKeepCookieAfterSessionEnds((b) => !b)}
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