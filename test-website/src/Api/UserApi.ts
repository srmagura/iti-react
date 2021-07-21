import { UserDto, EmailAddressDto, UserLogInDto } from 'Models'
import { get, post } from 'Api/ApiUtil'

export const userApi = {
    login: (data: { email: EmailAddressDto; password: string }) =>
        post<UserLogInDto>('api/user/login', data),

    me: () => get<UserDto>('api/user/me', {}),
}
