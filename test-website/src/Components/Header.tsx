import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { AppState } from '_Redux'
import { UserDto } from 'Models'
import { nullToUndefined } from '@interface-technologies/iti-react'

export enum NavbarLink {
    Index,
    Products
}

function linkClass(active: boolean) {
    let className = 'nav-link '

    if (active) className += 'active'

    return className
}

interface HeaderProps {
    user?: UserDto
    activeNavbarLink?: NavbarLink
}

function _Header(props: HeaderProps) {
    const { user, activeNavbarLink } = props

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
                    {/* <Link className="dropdown-item" to="/user/accountSettings">Account Settings</Link>*/}
                    <Link className="dropdown-item" to="/home/logout">
                        Log Out
                    </Link>
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
                                Products
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
        user: nullToUndefined(state.user)
    }
}

export const Header = connect(mapStateToProps)(_Header)
