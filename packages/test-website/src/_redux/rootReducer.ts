import { combineReducers } from 'redux'
import { authReducer } from '_redux/auth/authSlice'
import { errorReducer } from '_redux/error/errorSlice'

export const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
})
