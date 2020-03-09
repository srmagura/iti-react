import React, { HTMLAttributes } from 'react'

type LinkButtonProps = Omit<
    React.DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    'href' | 'onClick'
> & {
    onClick?(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void
}

// A quick way to create an element that looks like a link but behaves
// like a button
export function LinkButton(props: LinkButtonProps): React.ReactElement {
    return (
        <a
            {...props}
            href="#"
            onClick={(e): void => {
                e.preventDefault()
                if (props.onClick) props.onClick(e)
            }}
            role="button"
        />
    )
}
