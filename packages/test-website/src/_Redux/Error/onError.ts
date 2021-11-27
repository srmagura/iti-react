import { createAction } from '@reduxjs/toolkit'

export const onError = createAction<unknown>('error/onError')
