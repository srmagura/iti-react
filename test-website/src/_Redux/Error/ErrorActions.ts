import { getType, createStandardAction } from 'typesafe-actions'
import { ItiAction, actions } from '_Redux/Actions'
import { IError, processError, ErrorType, isIError } from './ErrorHandling'

export const errorActions = {
    onError: createStandardAction('ON_ERROR')<any>(),
    clearError: createStandardAction('CLEAR_ERROR')()
}
