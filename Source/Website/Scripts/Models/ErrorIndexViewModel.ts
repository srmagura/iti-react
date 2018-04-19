


import { ExampleUserDto } from './ExampleUserDto';
import { ErrorDto } from './ErrorDto';
import { ViewModel } from './ViewModel';


export const ErrorIndexViewModelTypeName = 'ErrorIndexViewModel'
export interface ErrorIndexViewModel extends ViewModel { 
	message: string
	isDebug: boolean
	diagnosticInformation: string
}
