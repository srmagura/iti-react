import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppState } from '_Redux'
import { UserDto } from 'Models'
import { nullToUndefined, LinkButton } from '@interface-technologies/iti-react'
import { logOut } from 'Components/Routing/LogOut'
import { RouteComponentProps } from 'react-router-dom'
import { NavbarLink } from './NavbarLink'

function linkClass(active: boolean) {
    let className = 'nav-link '

    if (active) className += 'active'

    return className
}

interface NavbarProps extends RouteComponentProps<any> {
    user?: UserDto
    activeNavbarLink?: NavbarLink
}

function _Navbar(props: NavbarProps) {
    const { user, activeNavbarLink, history } = props

    let userNavItem: React.ReactNode
    if (user) {
        userNavItem = (
            <li className="nav-item dropdown">
                <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="user-dropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {user.name}
                </a>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="user-dropdown"
                >
                    <LinkButton className="dropdown-item" onClick={() => logOut(history)}>
                        Log Out
                    </LinkButton>
                </div>
            </li>
        )
    } else {
        userNavItem = (
            <li className="nav-item" key="projects">
                <Link to="/home/login" className={linkClass(false)}>
                    Log In
                </Link>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    ITI React
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar-supported-content"
                    aria-controls="navbar-supported-content"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbar-supported-content">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className={linkClass(
                                    activeNavbarLink == NavbarLink.Index
                                )}
                            >
                                Index
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/product/list"
                                className={linkClass(
                                    activeNavbarLink == NavbarLink.Products
                                )}
                            >
                                Products (hooks)
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/product/listDataUpdater"
                                className={linkClass(
                                    activeNavbarLink == NavbarLink.ProductsDataUpdater
                                )}
                            >
                                Products (DataUpdater)
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">{userNavItem}</ul>
                </div>
            </div>
        </nav>
    )
}

function mapStateToProps(state: AppState) {
    return {
        user: nullToUndefined(state.auth.user)
    }
}

export const Navbar = withRouter(connect(mapStateToProps)(_Navbar))
