import { ErrorDtoType } from '.'

export const ErrorDtoTypeName = 'ErrorDto'
export interface ErrorDto {
    type: ErrorDtoType
    message: string
    diagnosticInfo: string
}
