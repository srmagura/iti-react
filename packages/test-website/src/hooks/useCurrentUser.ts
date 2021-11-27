import { api, queryKeys } from 'api'
import { UserDto } from 'models'
import moment from 'moment-timezone'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { selectAuthenticated } from '_redux'

export function useCurrentUser(): UseQueryResult<UserDto | undefined> {
    const authenticated = useSelector(selectAuthenticated)

    return useQuery(queryKeys.user.me(), () => api.user.me(), {
        enabled: authenticated,
        staleTime: moment.duration(1, 'day').asMilliseconds(),
    })
}
