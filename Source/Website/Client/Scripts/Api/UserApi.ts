import { UserDto, EmailAddress, UserLogInDto } from 'Models'
import { formatUrlParams } from 'Util/UrlUtil'
import { get, post, postVoid } from 'Api/ApiUtil'

export const userApi = {
    login: (data: { email: EmailAddress; password: string }) =>
        post<UserLogInDto>('api/user/login', data),

    me: () => get<UserDto>('api/user/me', {})
}
