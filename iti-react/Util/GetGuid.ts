﻿// Source: https://gist.github.com/jed/982883
// Great for React keys when there is no database ID that can be used

export function getGuid(a?: any) {
    return a
        ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getGuid)
}
