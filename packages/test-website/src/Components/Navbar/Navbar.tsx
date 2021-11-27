import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authActions, selectUser } from '_Redux'
import { LinkButton } from '@interface-technologies/iti-react'
import { NavbarLink } from './NavbarLink'

function linkClass(active: boolean) {
    let className = 'nav-link '

    if (active) className += 'active'

    return className
}

interface NavbarProps {
    activeNavbarLink?: NavbarLink
}

export function Navbar({ activeNavbarLink }: NavbarProps): ReactElement {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    let userNavItem: React.ReactNode
    if (user) {
        userNavItem = (
            <li className="nav-item dropdown">
                <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="user-dropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {user.name}
                </a>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="user-dropdown"
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
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContest"
                    aria-controls="navbarSupportedContest"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContest">
                    <ul className="navbar-nav me-auto">
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
