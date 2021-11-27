import { ITIAction } from '@interface-technologies/iti-react'
import { defaults } from 'lodash'
import { Reducer } from 'redux'
import { processError } from '_util/errorHandling/processError'
import { RequestStatus, defaultRequestStatus } from './RequestStatus'

type RequestStatusReducer = Reducer<RequestStatus, ITIAction>

interface RequestStatusActions {
    requestActions: { type: string }[]
    fulfilledActions: { type: string }[]
    rejectedActions: { type: string }[]
}

export function getRequestStatusReducerRaw(
    actions: RequestStatusActions
): RequestStatusReducer {
    const { requestActions, fulfilledActions, rejectedActions } = actions

    const reducer: RequestStatusReducer = (state = defaultRequestStatus, action) => {
        if (requestActions.some((ac) => action.type === ac.type)) {
            return {
                inProgress: true,
            }
        }

        if (fulfilledActions.some((ac) => action.type === ac.type)) {
            return {
                inProgress: false,
            }
        }

        if (rejectedActions.some((ac) => action.type === ac.type)) {
            const _action = action as { payload?: { error?: unknown } }

            return {
                inProgress: false,
                error: _action.payload ? processError(_action.payload.error) : undefined,
            }
        }

        return state
    }

    return reducer
}

export function getRequestStatusReducer(
    asyncAction: {
        request: { type: string }
        fulfilled: { type: string }
        rejected: { type: string }
    },
    additionalActions?: Partial<RequestStatusActions>
): RequestStatusReducer {
    if (!additionalActions) additionalActions = {}

    const additionalActions2: RequestStatusActions = defaults(additionalActions, {
        requestActions: [],
        fulfilledActions: [],
        rejectedActions: [],
    })

    return getRequestStatusReducerRaw({
        requestActions: [asyncAction.request, ...additionalActions2.requestActions],
        fulfilledActions: [asyncAction.fulfilled, ...additionalActions2.fulfilledActions],
        rejectedActions: [asyncAction.rejected, ...additionalActions2.rejectedActions],
    })
}
