export interface IAsyncProgress {
    [name: string]: boolean
}

export function areAnyInProgress(asyncProgress: IAsyncProgress) {
    return Object.values(asyncProgress).some(v => v)
}

interface IAsyncProgressState {
    asyncProgress: IAsyncProgress
}

// The caller should pass
//
//     f => this.setState(f)
//
// for the setState argument so that the 'this' context is correct.
export function childProgressChange(
    fieldName: string,
    inProgress: boolean,
    setState: (f: (state: IAsyncProgressState) => IAsyncProgressState) => void,
    onInProgressChange?: (inProgress: boolean) => void
) {
    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState((state: IAsyncProgressState) => {
        const asyncProgress = {
            ...state.asyncProgress,
            [fieldName]: inProgress
        }

        if (onInProgressChange) onInProgressChange(areAnyInProgress(asyncProgress))

        return { ...state, asyncProgress }
    })
}
