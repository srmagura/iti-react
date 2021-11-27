import { UserDto, UserLogInDto } from 'models'
import { ApiMethods } from './util'

export function userApi({ get, post }: ApiMethods) {
    return {
        login: (data: { email: string; password: string }) =>
            post<UserLogInDto>('api/user/login', data),

        me: () => get<UserDto>('api/user/me', {}),
    }
}
