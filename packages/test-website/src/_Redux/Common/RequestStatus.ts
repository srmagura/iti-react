import { IError } from '@interface-technologies/iti-react'
import { ErrorType } from '_util/errorHandling'

export interface RequestStatus {
    inProgress: boolean
    error?: IError<ErrorType>
}

export const defaultRequestStatus: RequestStatus = {
    inProgress: false,
}
