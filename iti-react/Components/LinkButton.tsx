import React from 'react'

type LinkButtonProps = Omit<React.DetailedHTMLProps<any, any>, 'href' | 'onClick'> & {
    onClick?(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void
}

// A quick way to create an element that looks like a link but behaves
// like a button
export function LinkButton(props: LinkButtonProps) {
    return (
        <a
            {...props}
            href="#"
            onClick={e => {
                e.preventDefault()
                if (props.onClick) props.onClick(e)
            }}
            role="button"
        />
    )
}
