﻿


import { UserDto } from './UserDto';
import { ViewModel } from './ViewModel';


export const HomeErrorViewModelTypeName = 'HomeErrorViewModel'
export class HomeErrorViewModel extends ViewModel { 
	Message: string
	IsDebug: boolean
	DiagnosticInformation: string
}
