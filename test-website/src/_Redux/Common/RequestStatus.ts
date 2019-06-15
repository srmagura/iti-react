import { IError } from 'Components'

export interface RequestStatus {
    inProgress: boolean
    error?: IError
}

export const defaultRequestStatus: RequestStatus = {
    inProgress: false
}
