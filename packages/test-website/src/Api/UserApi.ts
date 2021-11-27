import { UserDto, UserLogInDto } from 'models'
import { ApiMethods } from './util'

export function userApi({ get, post }: ApiMethods) {
    return {
        logIn: (data: { email: string; password: string }) =>
            post<UserLogInDto>('api/user/logIn', data),

        me: () => get<UserDto>('api/user/me', {}),
    }
}

export const userQueryKeys = {
    me: () => ['user', 'me'] as const,
}
