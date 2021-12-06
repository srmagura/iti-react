import { v4 } from 'uuid'

export function getGuid(): string {
    return v4()
}
