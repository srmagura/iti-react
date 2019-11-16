import { createAction } from 'typesafe-actions'

export const errorActions = {
    onError: createAction('ON_ERROR')<any>()
}
