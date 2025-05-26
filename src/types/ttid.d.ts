type _ttid = string | `${string}-${string}` | `${string}-${string}-${string}`

interface _timestamps {
    createdAt: number,
    updatedAt?: number,
    deletedAt?: number
}

declare module "@vyckr/ttid" {

    export default class {

        static isTTID(_id: string): RegExpMatchArray | Date | null

        static isUUID(_id: string): RegExpMatchArray | null

        static generate(_id?: string, del?: boolean): _ttid

        static decodeTime(_id: string): { createdAt: number, updatedAt: number }
    }
}