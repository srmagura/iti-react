import * as React from 'react'

interface IAnchorAttributes {}

interface IPagerLinkProps extends React.Props<any> {
    anchorAttributes: IAnchorAttributes
    active?: boolean
    enabled: boolean
}

// Mark as disabled (rather than making it invisible) so the pager doesn't
// jump around
function PagerLink(props: IPagerLinkProps): JSX.Element {
    const { active, anchorAttributes, enabled } = props

    return (
        <li
            className={
                'page-item ' +
                (active ? 'active' : '') +
                ' ' +
                (enabled ? '' : 'disabled')
            }
        >
            <a className="page-link" {...anchorAttributes}>
                {props.children}
            </a>
        </li>
    )
}

interface IPagerProps extends React.Props<any> {
    page: number
    totalPages: number
    onPageChange(page: number): void
}

export function Pager(props: IPagerProps): JSX.Element {
    const { page, totalPages, onPageChange } = props

    const anchorAttributesBuilder: ((
        page: number
    ) => IAnchorAttributes) = _page => ({
        href: 'javascript:void(0)',
        onClick: () => onPageChange(_page)
    })

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

        distance++
    }

    return (
        <nav aria-label="Page navigation" className="pagination-container">
            <ul className="pagination">
                <PagerLink
                    anchorAttributes={anchorAttributesBuilder(page - 1)}
                    key="prev"
                    enabled={hasPrevious}
                >
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                </PagerLink>

                {pageNumbers.map((i: number) => (
                    <PagerLink
                        anchorAttributes={anchorAttributesBuilder(i)}
                        active={page === i}
                        key={i.toString()}
                        enabled={true}
                    >
                        {i}
                    </PagerLink>
                ))}

                <PagerLink
                    anchorAttributes={anchorAttributesBuilder(page + 1)}
                    key="next"
                    enabled={hasNext}
                >
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                </PagerLink>
            </ul>
        </nav>
    )
}
