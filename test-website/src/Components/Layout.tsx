﻿import React from 'react'
import { NavbarLink } from 'Components/Navbar/NavbarLink'
import { Navbar } from 'Components/Navbar/Navbar'
import { Footer } from 'Components/Footer'
import {
    ItiReactContext,
    ItiReactContextData,
    defaultItiReactContextData
} from '@interface-technologies/iti-react'
import { LoadingIcon } from 'Components/Icons'
import ReactHintFactory from 'react-hint'
import { processError, ErrorType } from '_Redux'
const ReactHint = ReactHintFactory(React)

const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <LoadingIcon />,
    useAutoRefreshQuery: {
        ...defaultItiReactContextData.useAutoRefreshQuery,
        isConnectionError: e => processError(e).type === ErrorType.ConnectionError
    },
    addressInput: { allowCanadian: true }
}

interface LayoutProps {
    activeNavbarLink?: NavbarLink
    children: React.ReactNode
}

export function Layout(props: LayoutProps) {
    const { children, activeNavbarLink } = props

    return (
        <div className="layout">
            <ReactHint events delay={100} attribute="data-tooltip" />
            <Navbar activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content">
                        <ItiReactContext.Provider value={itiReactContextData}>
                            {children}
                        </ItiReactContext.Provider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
