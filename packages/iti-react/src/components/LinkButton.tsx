import React, { HTMLAttributes } from 'react'

export type LinkButtonProps = Omit<
    React.DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    'href' | 'onClick'
> & {
    onClick?(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void
}

/**
 * A quick way to create an element that looks like a link but behaves
 * like a button.
 */
export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    (props, ref) => {
        const { children, onClick, ...passThroughProps } = props

        /* eslint-disable jsx-a11y/anchor-is-valid */
        return (
            <a
                {...passThroughProps}
                ref={ref}
                href="#"
                onClick={(e): void => {
                    e.preventDefault()
                    if (onClick) onClick(e)
                }}
                role="button"
            >
                {children}
            </a>
        )
    }
)
