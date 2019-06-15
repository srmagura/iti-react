import { UserDto, EmailAddress, UserLogInDto } from 'Models'
import { get, post } from 'Api/ApiUtil'

export const userApi = {
    login: (data: { email: EmailAddress; password: string }) =>
        post<UserLogInDto>('api/user/login', data),

    me: () => get<UserDto>('api/user/me', {})
}
