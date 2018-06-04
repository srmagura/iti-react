export interface IAsyncProgress {
    [name: string]: boolean;
}

export function areNoneInProgress(asyncProgress: IAsyncProgress) {
    for (const name in asyncProgress) {
        if (asyncProgress.hasOwnProperty(name)) {
            if (asyncProgress[name])
                return false;
        }
    }

    return true;
}

interface IAsyncProgressState {
    asyncProgress: IAsyncProgress;
}

// The caller should pass
//
//     f => this.setState(f)
//
// for the setState argument so that the 'this' context is correct.
export function childProgressChange(fieldName: string, valid: boolean,
    setState: (f: (state: IAsyncProgressState) => IAsyncProgressState) => void,
    onInProgressChange?: (valid: boolean) => void) {
    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState((state: IAsyncProgressState) => {
        const asyncProgress =
        {
            ...state.asyncProgress,
            [fieldName]: valid
        };

        if (onInProgressChange)
            onInProgressChange(areNoneInProgress(asyncProgress));

        return { ...state, asyncProgress };
    });
}