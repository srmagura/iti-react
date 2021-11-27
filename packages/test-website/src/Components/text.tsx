import { PropsWithChildren, ReactElement } from 'react'

export function FormError({ children }: PropsWithChildren<unknown>): ReactElement {
    return (
        <p
            style={{
                fontWeight: 600,
            }}
            className="text-danger"
        >
            {children}
        </p>
    )
}
