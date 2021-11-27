import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authActions } from '_redux'
import { LinkButton } from '@interface-technologies/iti-react'
import { useCurrentUser } from 'hooks'
import { NavbarLink } from './NavbarLink'

function linkClass(active: boolean): string {
    let className = 'nav-link '

    if (active) className += 'active'

    return className
}

interface NavbarProps {
    activeNavbarLink?: NavbarLink
}

export function Navbar({ activeNavbarLink }: NavbarProps): ReactElement {
    const dispatch = useDispatch()
    const { data: user } = useCurrentUser()

    let userNavItem: React.ReactNode
    if (user) {
        userNavItem = (
            <li className="nav-item dropdown">
                <LinkButton
                    className="nav-link dropdown-toggle"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {user.name}
                </LinkButton>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="userDropdown"
                >
                    <LinkButton
                        className="dropdown-item"
                        onClick={() => dispatch(authActions.logOut())}
                    >
                        Log Out
                    </LinkButton>
                </div>
            </li>
        )
    } else {
        userNavItem = (
            <li className="nav-item">
                <Link to="/home/login" className={linkClass(false)}>
                    Log In
                </Link>
            </li>
        )
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    ITI React
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                to="/"
                                className={linkClass(
                                    activeNavbarLink === NavbarLink.Index
                                )}
                            >
                                Index
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">{userNavItem}</ul>
                </div>
            </div>
        </nav>
    )
}
