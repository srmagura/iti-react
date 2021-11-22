import { UserDto, EmailAddressDto, UserLogInDto } from 'Models'
import { get, post } from 'api/ApiUtil'

export const userApi = {
    login: (data: { email: EmailAddressDto; password: string }) =>
        post<UserLogInDto>('api/user/login', data),

    me: () => get<UserDto>('api/user/me', {}),
}
