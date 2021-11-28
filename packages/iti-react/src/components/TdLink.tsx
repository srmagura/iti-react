import React, { PropsWithChildren } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export type TdLinkProps = PropsWithChildren<Omit<LinkProps, 'to'>>

/**
 * Makes a table cell into a link.
 *
 * `TdLink` has styles that are required for it to work correctly.
 *
 * ```
 * <table className="table table-hover table-td-link">
 *     <tbody>
 *         {products.map(p => {
 *             const Td = getTdLink('/product/detail/' + p.id)
 *
 *             return (
 *                 <tr key={p.id}>
 *                     <Td>{p.id}</Td>
 *                     <Td>{p.name}</Td>
 *                     <Td>{p.stock}</Td>
 *                 </tr>
 *             )
 *          })}
 *     </tbody>
 * </table>
 * ```
 */
export function getTdLink(
    to: string,
    tdProps?: React.HTMLProps<HTMLTableCellElement>
): React.FC<TdLinkProps> {
    function TdLink({
        children,
        className,
        ...otherProps
    }: TdLinkProps): React.ReactElement {
        const classes = ['td-link']
        if (className) classes.push(className)

        return (
            <td {...tdProps}>
                <Link to={to} className={classes.join(' ')} {...otherProps}>
                    {children}
                </Link>
            </td>
        )
    }

    return TdLink
}
