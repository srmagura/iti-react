


import { UserDto } from './UserDto';
import { ViewModel } from './ViewModel';


export const ErrorIndexViewModelTypeName = 'ErrorIndexViewModel'
export interface ErrorIndexViewModel extends ViewModel { 
	Message: string
	IsDebug: boolean
	DiagnosticInformation: string
}
