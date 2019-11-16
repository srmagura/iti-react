import React from 'react'
import { connect } from 'react-redux'
import { UserDto } from 'Models'
import { PageProps } from 'Components/Routing/RouteProps'
import { FormGroup } from 'Components/FormGroup'
import {
    ValidatedInput,
    FieldValidity,
    childValidChange,
    Validators,
    SubmitButton,
    CancellablePromise,
    FormCheck,
    nullToUndefined
} from '@interface-technologies/iti-react'
import { actions, AppState } from '_Redux'
import { ErrorType, RequestStatus } from '_Redux'

interface LoginPageProps extends PageProps {
    user?: UserDto
    logInRequestStatus: RequestStatus

    logIn(payload: ReturnType<typeof actions.auth.logInAsync.request>['payload']): unknown
}

interface PageState {
    email: string
    password: string
    keepCookieAfterSessionEnds: boolean

    fieldValidity: FieldValidity
    showValidation: boolean
}

class _Page extends React.Component<LoginPageProps, PageState> {
    state: PageState = {
        email: '',
        password: '',
        keepCookieAfterSessionEnds: true,

        fieldValidity: {},
        showValidation: false
    }

    ajaxRequest?: CancellablePromise<any>
    hasRedirected = false

    componentDidMount() {
        this.redirectIfLoggedIn()

        this.props.onReady({
            title: 'Log In'
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
        const { email, password, keepCookieAfterSessionEnds } = this.state

        this.props.logIn({
            email: { value: email },
            password,
            keepCookieAfterSessionEnds
        })

        return false
    }

    childValidChange = (fieldName: string, valid: boolean) => {
        childValidChange(fieldName, valid, x => this.setState(...x))
    }

    render() {
        if (!this.props.ready) return null

        const { logInRequestStatus } = this.props
        const { showValidation, email, password, keepCookieAfterSessionEnds } = this.state

        const vProps = {
            showValidation,
            onValidChange: this.childValidChange
        }

        return (
            <div>
                <div className="heading-row">
                    <h1>Log In</h1>
                </div>
                <form onSubmit={this.submit} className="form-limit-width" noValidate>
                    {logInRequestStatus.error &&
                        logInRequestStatus.error.type === ErrorType.InvalidLogin && (
                            <p className="text-danger">Login failed. Please try again.</p>
                        )}
                    <FormGroup label="Email address">
                        <ValidatedInput
                            name="email"
                            type="email"
                            value={email}
                            onChange={email => this.setState({ email })}
                            validators={[Validators.required(), Validators.email()]}
                            {...vProps}
                        />
                    </FormGroup>
                    <FormGroup label="Password">
                        <ValidatedInput
                            name="password"
                            type="password"
                            value={password}
                            onChange={password => this.setState({ password })}
                            validators={[Validators.required()]}
                            {...vProps}
                        />
                    </FormGroup>
                    <div className="form-group">
                        <FormCheck
                            name="keepCookieAfterSessionEnds"
                            label="Keep me logged in"
                            checked={keepCookieAfterSessionEnds}
                            onChange={() =>
                                this.setState({
                                    keepCookieAfterSessionEnds: !keepCookieAfterSessionEnds
                                })
                            }
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

    componentWillUnmount() {
        if (this.ajaxRequest) this.ajaxRequest.cancel()
    }
}

function mapStateToProps(state: AppState) {
    return {
        user: nullToUndefined(state.auth.user),
        logInRequestStatus: state.auth.logInRequestStatus
    }
}

const actionMap = {
    logIn: actions.auth.logInAsync.request
}

export const Page = connect(mapStateToProps, actionMap)(_Page)
