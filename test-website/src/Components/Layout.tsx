import React from 'react'
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

const ReactHint = ReactHintFactory(React)

export let forceUpdateTooltips: () => void = () => {}

const itiReactContextData: ItiReactContextData = {
    ...defaultItiReactContextData,
    renderLoadingIndicator: () => <LoadingIcon />,
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
            <ReactHint
                events
                delay={100}
                attribute="data-tooltip"
                ref={(ref: any) => {
                    if (ref) {
                        forceUpdateTooltips = () => {
                            ref.forceUpdate()
                        }
                    }
                }}
            />
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
