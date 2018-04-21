import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

export const appTitle = 'React SPA template'

interface ITitleProps extends React.Props<any> {
    title: string
}

export function Title(props: ITitleProps) {
    const { title, children } = props

    return <DocumentTitle title={`${title} - ${appTitle}`}>
        {/* DocumentTitle can only have 1 child */}
        <div>
            {children}
        </div>
    </DocumentTitle>
}