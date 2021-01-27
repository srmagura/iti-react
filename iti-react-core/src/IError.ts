// "I" to avoid conflict with built-in Error type
export class IError<TType> extends Error {
    readonly type: TType

    readonly message: string

    readonly diagnosticInfo?: string

    handled: boolean

    data: { [key: string]: unknown }

    constructor({
        type,
        message,
        diagnosticInfo,
        handled,
        data,
    }: {
        type: TType
        message: string
        diagnosticInfo?: string
        handled?: boolean
        data?: IError<TType>['data']
    }) {
        super()
        this.type = type
        this.message = message
        this.diagnosticInfo = diagnosticInfo
        this.handled = handled ?? false
        this.data = data ?? {}
    }
}

export function hasIErrorProperties<TType>(obj: unknown): obj is IError<TType> {
    return (
        !!obj &&
        Object.prototype.hasOwnProperty.call(obj, 'message') &&
        Object.prototype.hasOwnProperty.call(obj, 'type') &&
        !Object.prototype.hasOwnProperty.call(obj, 'typeName')
    )
}
