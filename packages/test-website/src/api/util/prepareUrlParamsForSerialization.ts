import { isMoment } from 'moment-timezone'
import { ConvertableToUrlParamsObject } from './ApiMethods'

function prepareUrlParamForSerialization(
    param: string | number | boolean | moment.Moment
): string {
    if (isMoment(param)) return param.toISOString()

    return param.toString()
}

export function prepareUrlParamsForSerialization(
    urlParams: ConvertableToUrlParamsObject
): Record<string, string> {
    const returnValue: Record<string, string> = {}

    for (const [key, value] of Object.entries(urlParams)) {
        if (value !== null && typeof value !== 'undefined') {
            returnValue[key] = prepareUrlParamForSerialization(value)
        }
    }

    return returnValue
}
