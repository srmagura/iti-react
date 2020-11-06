// "I" to avoid conflict with built-in Error type
export class IError<TType> extends Error {
    readonly type: TType

    readonly message: string

    readonly diagnosticInfo?: string

    handled = false

    data: { [key: string]: unknown } = {}

    constructor(type: TType, message: string, diagnosticInfo?: string) {
        super()
        this.type = type
        this.message = message
        this.diagnosticInfo = diagnosticInfo
    }
}

export function createIError<TType>(e: {
    type: TType
    message: string
    diagnosticInfo?: string
    handled?: boolean
    data?: IError<TType>['data']
}): IError<TType> {
    const ierror = new IError<TType>(e.type, e.message, e.diagnosticInfo)

    ierror.handled = e.handled ?? false
    if (e.data) ierror.data = e.data

    return ierror
}

export function hasIErrorProperties<TType>(obj: unknown): obj is IError<TType> {
    return (
        obj &&
        Object.prototype.hasOwnProperty.call(obj, 'message') &&
        Object.prototype.hasOwnProperty.call(obj, 'type') &&
        !Object.prototype.hasOwnProperty.call(obj, 'typeName')
    )
}
