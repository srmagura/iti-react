import { isEqual } from 'lodash'
import { isMoment } from 'moment-timezone'
import { Identity } from 'models'
import {
    ConvertableToUrlParamsObject,
    ConvertableToUrlParamValue,
    UrlParamsObject,
    UrlParamValue,
} from './ApiMethods'

function paramIsIdentity(param: ConvertableToUrlParamValue): param is Identity {
    return !!param && isEqual(Object.keys(param), ['guid'])
}

function prepareUrlParamForSerialization(
    param: ConvertableToUrlParamValue
): UrlParamValue {
    if (param) {
        if (paramIsIdentity(param)) {
            return param.guid
        }

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
