import React from 'react'
import { defaults } from 'lodash'
import { LinkButton } from './LinkButton'

interface PagerLinkProps {
    onClick(): void
    active?: boolean
    enabled: boolean
    children?: React.ReactNode
}

// Mark as disabled (rather than making it invisible) so the pager doesn't
// jump around
function PagerLink(props: PagerLinkProps): JSX.Element {
    const { active, onClick, enabled } = props

    return (
        <li
            className={
                `page-item ${ 
                active ? 'active' : '' 
                } ${ 
                enabled ? '' : 'disabled'}`
            }
        >
            <LinkButton
                className="page-link"
                tabIndex={enabled ? undefined : -1}
                onClick={onClick}
            >
                {props.children}
            </LinkButton>
        </li>
    )
}

interface PagerProps {
    page: number
    totalPages: number
    onPageChange(page: number): void

    enabled?: boolean
    containerClassName?: string
}

export function Pager(props: PagerProps): React.ReactElement {
    const { page, totalPages, onPageChange, enabled, containerClassName } = defaults(
        { ...props },
        { enabled: true, containerClassName: 'pagination-container' }
    )

    const firstPage = 1
    const hasPrevious = page !== firstPage
    const hasNext = page < totalPages

    // Don't want to show too many pages if there are a lot
    const pagesToDisplay = 5 // odd number

    let pageNumbers = [page]

    let distance = 1

    // add page number to the left and right until hit the pagesToDisplay
    // and/or run out of pages
    while (true) {
        const left = page - distance
        const addLeft = left >= firstPage
        if (addLeft) pageNumbers = [left].concat(pageNumbers)

        const right = page + distance
        const addRight = right <= totalPages
        if (addRight) pageNumbers.push(right)

        if (pageNumbers.length === pagesToDisplay || (!addLeft && !addRight)) {
            break
        }

        distance += 1
    }

    return (
        <nav aria-label="Page navigation" className={containerClassName}>
            <ul className="pagination">
                <PagerLink
                    onClick={(): void => onPageChange(page - 1)}
                    key="prev"
                    enabled={enabled && hasPrevious}
                >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                </PagerLink>

                {pageNumbers.map((i: number) => (
                    <PagerLink
                        onClick={(): void => onPageChange(i)}
                        active={page === i}
                        key={i.toString()}
                        enabled={enabled}
                    >
                        {i}
                    </PagerLink>
                ))}

                <PagerLink
                    onClick={(): void => onPageChange(page + 1)}
                    key="next"
                    enabled={enabled && hasNext}
                >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                </PagerLink>
            </ul>
        </nav>
    )
}
