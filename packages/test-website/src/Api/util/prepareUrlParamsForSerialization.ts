import { isMoment } from 'moment-timezone'
import {
    ConvertableToUrlParamsObject,
    ConvertableToUrlParamValue,
    UrlParamsObject,
    UrlParamValue,
} from './ApiMethods'

function prepareUrlParamForSerialization(
    param: ConvertableToUrlParamValue
): UrlParamValue {
    if (param) {
        if (isMoment(param)) {
            return param.toISOString()
        }
    }

    return param
}

export function prepareUrlParamsForSerialization(
    urlParams: ConvertableToUrlParamsObject
): UrlParamsObject {
    const returnValue: UrlParamsObject = {}

    for (const key of Object.keys(urlParams)) {
        returnValue[key] = prepareUrlParamForSerialization(urlParams[key])
    }

    return returnValue
}
