


import { UserDto } from './UserDto';
import { ErrorDto } from './ErrorDto';
import { ViewModel } from './ViewModel';


export const ReactViewModelTypeName = 'ReactViewModel'
export interface ReactViewModel  { 
	page: string
	baseUrl: string
	viewModel: ViewModel
}
