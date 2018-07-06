import * as React from 'react'
import { connect } from 'react-redux'
import { UserDto } from 'Models'
import { IPageProps } from 'Components/Routing/RouteProps'
import { api } from 'Api'
import { actions } from 'AppState'
import * as Cookies from 'js-cookie'
import * as Constants from 'Components/Constants'

interface ILogoutPageProps extends IPageProps {
    setUser: (user: UserDto | null) => any
}

interface IPageState {
    shouldRedirect: boolean
}

class _Page extends React.Component<ILogoutPageProps, IPageState> {
    state: IPageState = { shouldRedirect: false }

    componentDidMount() {
        const { onReady } = this.props

        // must call onReady so the previous page gets unmounted
        onReady({
            title: 'Logging out...',
            activeNavbarLink: undefined,
            pageId: 'page-home-logout'
        })

        this.setState({ shouldRedirect: true })
    }

    componentDidUpdate() {
        const { history, setUser } = this.props
        const { shouldRedirect } = this.state

        if (shouldRedirect) {
            Cookies.remove(Constants.accessTokenCookieName)
            setUser(null)

            this.setState({ shouldRedirect: false })
            history.push('/home/login')
        }
    }

    render() {
        return null
    }
}

export const Page = connect(
    undefined,
    { setUser: actions.setUser }
)(_Page)
