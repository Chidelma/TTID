export default class ULID {

    private static multiple = 10000

    private static minBase = 18

    private static timeNow = () => (performance.now() + performance.timeOrigin) * ULID.multiple

    static isULID(_id: string) {

        return _id.match(/^[A-Z0-9]+-(?:[2-9]|[1-2][0-9]|3[0-6])-[A-Z0-9]+$/i)
    }

    static isUUID(_id: string) {

        return _id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    }

    static generate() {

        const time = ULID.timeNow()
        
        const nums = String(time).split('').map(Number)

        const base = ULID.getRandomBase(nums.reverse())

        const timeCode = time.toString(base)

        return `${timeCode}-${base}-${timeCode}`.toUpperCase() as _ulid
    }

    private static getRandomBase(nums: number[]) {

        return nums.reduce((prev, curr) => {
            
            if(prev < ULID.minBase) prev += curr

            return prev

        }, 0)
    }

    static update(_id: string) {

        if (!ULID.isULID(_id)) throw new Error('Invalid ULID')

        const [created, base] = _id.split('-')

        const timeCode = ULID.timeNow().toString(Number(base))

        return `${created}-${base}-${timeCode}`.toUpperCase() as _ulid
    }

    static decodeTime(_id: string) {

        if (!ULID.isULID(_id)) throw new Error('Invalid ULID')

        const [created, base, updated] = _id.split('-')

        const convertToMilliseconds = (timeCode: string) => Number((parseInt(timeCode, Number(base)) / ULID.multiple).toFixed(0))

        return {
            createdAt: convertToMilliseconds(created),
            updatedAt: convertToMilliseconds(updated)
        }
    }
}                                      