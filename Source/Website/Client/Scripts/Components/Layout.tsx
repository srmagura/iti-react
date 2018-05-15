import * as React from 'react';
import { NavbarLink, Header } from 'Components/Header';
import { Footer } from 'Components/Footer';
import { ValidationContext, IValidationContextData } from 'Util/ITIReact';
import { LoadingIcon } from 'Components/Icons';

const validationContextData: IValidationContextData = {
    loadingIndicatorComponent: LoadingIcon
}

interface ILayoutProps extends React.Props<any> {
    activeNavbarLink?: NavbarLink
    pageId?: string
}

export function Layout(props: ILayoutProps) {
    const { children, pageId, activeNavbarLink } = props

    return (
        <div className="layout">
            <Header activeNavbarLink={activeNavbarLink} />
            <div className="body-container-wrapper">
                <div className="container">
                    <div className="body-content" id={pageId}>
                        <ValidationContext.Provider value={validationContextData}>
                            {children}
                        </ValidationContext.Provider>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}