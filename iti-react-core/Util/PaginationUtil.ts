export function getTotalPages(itemCount: number, pageSize: number): number {
    return Math.ceil(itemCount / pageSize)
}

export function getPage<T>(allItems: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize
    return allItems.slice(start, start + pageSize)
}
