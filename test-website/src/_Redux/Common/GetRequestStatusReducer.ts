import { getType, ActionCreator } from 'typesafe-actions'
import { processError } from '_Redux/Error/ErrorHandling'
import { RequestStatus, defaultRequestStatus } from './RequestStatus'
import { ItiAction } from '_Redux/Actions'
import { defaults } from 'lodash'

type RequestStatusReducer = (
    state: RequestStatus | undefined,
    action: ItiAction
) => RequestStatus

export interface RequestStatusActions {
    requestActions: ActionCreator<any>[]
    successActions: ActionCreator<any>[]
    failureActions: ActionCreator<any>[]
}

export function getRequestStatusReducerRaw(
    actions: RequestStatusActions
): RequestStatusReducer {
    const { requestActions, successActions, failureActions } = actions

    return (state = defaultRequestStatus, action) => {
        if (requestActions.some(ac => action.type === getType(ac))) {
            return {
                inProgress: true
            }
        }

        if (successActions.some(ac => action.type === getType(ac))) {
            return {
                inProgress: false
            }
        }

        if (failureActions.some(ac => action.type === getType(ac))) {
            const _action = action as any

            return {
                inProgress: false,
                error: _action.payload ? _action.payload.error : undefined
            }
        }

        return state
    }
}

export function getRequestStatusReducer(
    asyncAction: {
        request: ActionCreator<any>
        success: ActionCreator<any>
        failure: ActionCreator<any>
    },
    additionalActions?: Partial<RequestStatusActions>
): RequestStatusReducer {
    if (!additionalActions) additionalActions = {}

    const additionalActions2: RequestStatusActions = defaults(additionalActions, {
        requestActions: [],
        successActions: [],
        failureActions: []
    })

    return getRequestStatusReducerRaw({
        requestActions: [asyncAction.request, ...additionalActions2.requestActions],
        successActions: [asyncAction.success, ...additionalActions2.successActions],
        failureActions: [asyncAction.failure, ...additionalActions2.failureActions]
    })
}
