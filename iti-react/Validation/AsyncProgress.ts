export interface AsyncProgress {
    [name: string]: boolean
}

export function areAnyInProgress(asyncProgress: AsyncProgress) {
    return Object.values(asyncProgress).some(v => v)
}

interface AsyncProgressState {
    asyncProgress: AsyncProgress
}

// The caller should pass
//
//     x => this.setState(...x)
//
// for the setState argument.
export function childProgressChange(
    fieldName: string,
    inProgress: boolean,
    setState: (
        x: [(state: AsyncProgressState) => AsyncProgressState, () => void]
    ) => void,
    callback?: (inProgress: boolean) => void
) {
    let anyInProgress: boolean | undefined

    // May have issues with state updates conflicting if we don't pass a
    // function to setState
    setState([
        (state: AsyncProgressState) => {
            const asyncProgress = {
                ...state.asyncProgress,
                [fieldName]: inProgress
            }

            anyInProgress = areAnyInProgress(asyncProgress)

            return { ...state, asyncProgress }
        },
        () => {
            if (callback) {
                if (typeof anyInProgress === 'undefined')
                    throw new Error('anyInProgress was undefined.')

                callback(anyInProgress)
            }
        }
    ])
}
