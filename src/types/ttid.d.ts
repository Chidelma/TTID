type _ttid = `${string}-${number}-${string}`

declare module "@vyckr/ttid" {

    export default class {

        static isTTID(_id: string): RegExpMatchArray | null

        static isUUID(_id: string): RegExpMatchArray | null

        static generate(): _ttid

        static update(_id: string): _ttid

        static decodeTime(_id: string): { createdAt: number, updatedAt: number }
    }
}