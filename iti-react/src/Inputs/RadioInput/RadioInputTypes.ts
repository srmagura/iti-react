/** The value type for [[`RadioInput`]]. */
export type RadioInputValue = string | number | null

/** The option type for [[`RadioInput`]]. */
export interface RadioOption {
    value: string | number
    label: React.ReactNode
}
