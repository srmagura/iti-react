import { combineReducers } from 'redux'
import { authReducer } from '_redux/auth/authSlice'
import { errorReducer } from '_redux/error/errorSlice'
import { authBootstrappedReducer } from './auth/authBootstrappedSlice'

export const rootReducer = combineReducers({
    auth: authReducer,
    authBootstrapped: authBootstrappedReducer,
    error: errorReducer,
})
