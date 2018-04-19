


import { IanaTimeZone } from './IanaTimeZone';
import { ExampleUserDto } from './ExampleUserDto';
import { ErrorDto } from './ErrorDto';
import { ViewModel } from './ViewModel';


export const ReactViewModelTypeName = 'ReactViewModel'
export interface ReactViewModel  { 
	page: string
	baseUrl: string
	viewModel: ViewModel
}
