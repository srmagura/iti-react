import { createStandardAction } from 'typesafe-actions'

export const errorActions = {
    onError: createStandardAction('ON_ERROR')<any>(),
    clearError: createStandardAction('CLEAR_ERROR')()
}
