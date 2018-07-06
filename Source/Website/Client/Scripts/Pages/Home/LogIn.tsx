﻿import * as React from 'react'
import * as moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ErrorDto, UserDto, EmailAddress } from 'Models'
import { IPageProps } from 'Components/Routing/RouteProps'
import { FormGroup } from 'Components/FormGroup'
import {
    ValidatedInput,
    IFieldValidity,
    childValidChange,
    Validators,
    fieldValidityIsValid,
    SubmitButton,
    ICancellablePromise,
    cancellableThen,
    withCancel
} from '@interface-technologies/iti-react'
import * as FormUtil from 'Util/FormUtil'
import { api } from 'Api'
import { actions, IAppState } from 'AppState'
import * as Cookies from 'js-cookie'
import { CookieAttributes } from 'js-cookie'
import { accessTokenCookieName } from 'Components/Constants'

export function logIn(
    email: EmailAddress,
    password: string,
    rememberMe: boolean,
    setUser: (user: UserDto | null) => any
): ICancellablePromise<void> {
    let ajaxRequest: ICancellablePromise<any> | undefined

    async function inner() {
        const { accessToken, expiresUtc } = await (ajaxRequest = api.user.login({
            email,
            password
        }))

        const cookieAttr: CookieAttributes = {
            secure: !(window as any).isDebug
        }

        // if cookieAttr.expires is not set, cookie will expire when browser is closed
        if (rememberMe)
            cookieAttr.expires = moment
                .utc(expiresUtc)
                .local()
                .toDate()

        Cookies.set(accessTokenCookieName, accessToken, cookieAttr)

        const user = await (ajaxRequest = api.user.me())
        setUser(user)
    }

    return withCancel(inner(), () => {
        if (ajaxRequest) ajaxRequest.cancel()
    })
}

interface ILoginPageProps extends IPageProps {
    user: UserDto | null
    setUser(user: UserDto | null): any
}

interface IPageState {
    fieldValidity: IFieldValidity
    showValidation: boolean
    loginFailed: boolean
    submitting: boolean
}

class _Page extends React.Component<ILoginPageProps, IPageState> {
    state: IPageState = {
        fieldValidity: {},
        showValidation: false,
        loginFailed: false,
        submitting: false
    }

    formId = 'login-form'

    ajaxRequest?: ICancellablePromise<any>
    hasRedirected = false

    componentDidMount() {
        const { onReady, user } = this.props

        this.redirectIfLoggedIn()

        onReady({
            title: 'Log In',
            activeNavbarLink: undefined,
            pageId: 'page-home-login'
        })
    }

    componentDidUpdate() {
        this.redirectIfLoggedIn()
    }

    redirectIfLoggedIn() {
        const { user, history } = this.props

        if (user && !this.hasRedirected) {
            this.hasRedirected = true
            history.push('/')
            return
        }
    }

    submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        this.setState({ showValidation: true })

        const { fieldValidity } = this.state
        if (!fieldValidityIsValid(fieldValidity)) return false

        this.setState({ submitting: true })
        const data = FormUtil.formToObject($('#' + this.formId))

        try {
            await (this.ajaxRequest = logIn(
                { value: data.email },
                data.password,
                data.rememberMe,
                this.props.setUser
            ))

            // setting the user will indirectly lead to redirectIfLoggedIn being called
        } catch (e) {
            this.setState({ submitting: false })

            if (e.status === 400) {
                this.setState({ loginFailed: true })
                return false
            }

            this.props.onError(e)
        }

        return false
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, f => this.setState(f))
    }

    render() {
        if (!this.props.ready) return null

        const { showValidation, loginFailed, submitting } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div>
                <div className="heading-row">
                    <h1>Log In</h1>
                </div>
                <form
                    id={this.formId}
                    onSubmit={this.submit}
                    className="form-limit-width"
                    noValidate
                >
                    {loginFailed && (
                        <p className="text-danger">Login failed. Please try again.</p>
                    )}
                    <FormGroup label="Email address" htmlFor="email" colClass="">
                        <ValidatedInput
                            name="email"
                            type="email"
                            validators={[Validators.required(), Validators.email()]}
                            {...vProps}
                        />
                    </FormGroup>
                    <FormGroup label="Password" htmlFor="password" colClass="">
                        <ValidatedInput
                            name="password"
                            type="password"
                            validators={[Validators.required()]}
                            {...vProps}
                        />
                    </FormGroup>
                    <p>
                        <input type="checkbox" name="rememberMe" defaultChecked={true} />{' '}
                        <label htmlFor="rememberMe">Keep me logged in</label>
                    </p>
                    <p>
                        <SubmitButton
                            className="btn btn-primary"
                            type="submit"
                            submitting={submitting}
                        >
                            Log in
                        </SubmitButton>
                    </p>
                    {/* <p>
                    <Link to="/user/requestPasswordReset">Forgot your password?</Link>
                </p>*/}
                </form>
            </div>
        )
    }

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }
}

function mapStateToProps(state: IAppState) {
    return {
        user: state.user
    }
}

export const Page = connect(
    mapStateToProps,
    { setUser: actions.setUser }
)(_Page)