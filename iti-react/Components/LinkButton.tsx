﻿import * as React from 'react'

type LinkButtonProps = Omit<React.DetailedHTMLProps<any, any>, 'href'>

// A quick way to create an element that looks like a link but behaves
// like a button
export function LinkButton(props: LinkButtonProps) {
    return (
        <a
            {...props}
            href="#"
            onClick={e => {
                e.preventDefault()
                props.onClick(e)
            }}
            role="button"
        />
    )
}
