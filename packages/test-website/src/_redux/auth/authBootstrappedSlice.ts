import { createReducer } from '@reduxjs/toolkit'
import type { AppState } from '_redux/AppState'
import { authActions } from './authSlice'

// A boolean indicating if the authSaga has completed its initial tasks
export const authBootstrappedReducer = createReducer<boolean>(false, (builder) => {
    builder.addCase(authActions.authBootstrapped.toString(), () => true)
})

export function selectAuthBootstrapped(state: AppState): boolean {
    return state.authBootstrapped
}
