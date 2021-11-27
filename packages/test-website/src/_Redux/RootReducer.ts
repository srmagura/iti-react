import { combineReducers } from 'redux'
import { authReducer } from '_Redux/Auth/authSlice'
import { errorReducer } from '_Redux/Error/errorSlice'

export const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
})
