import { IError } from '_Redux/Error/ErrorHandling'

export interface RequestStatus {
    inProgress: boolean
    error?: IError
}

export const defaultRequestStatus: RequestStatus = {
    inProgress: false,
}
