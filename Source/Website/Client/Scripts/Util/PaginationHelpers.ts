export function getTotalPages(items: any[], pageSize: number): number {
    return Math.ceil(items.length / pageSize)
}

export function getPage<T>(allItems: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize
    return allItems.slice(start, start + pageSize)
}
