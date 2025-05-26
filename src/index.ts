export default class {

    private static multiple = 10000

    private static base = 36

    private static placeholder = 'X'

    private static timeNow = () => (performance.now() + performance.timeOrigin) * this.multiple

    private static isTTIDFormat = (_id: string) => _id.match(/^[A-Z0-9]{11}(-[A-Z0-9]{1,11}){0,2}$/i)
    
    static isTTID(_id: string) {

        let isValid: RegExpMatchArray | Date | null = this.isTTIDFormat(_id)

        if(!isValid) return isValid

        const { createdAt, updatedAt, deletedAt } = this.decodeTime(_id)

        try {
            
            if(updatedAt) new Date(updatedAt)

            if(deletedAt) new Date(deletedAt)
            
            isValid = new Date(createdAt)

        } catch {

            isValid = null
        }

        return isValid
    }

    static isUUID(_id: string) {

        return _id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    }

    static generate(_id?: string, del: boolean = false) {

        if(_id && this.isTTID(_id) && _id.split('-').length === 3) throw new Error('This identifer can no longer be modified') 

        const time = this.timeNow()
        
        if(_id && this.isTTID(_id) && del) {

            const [created, updated] = _id.split('-')

            const deleted = time.toString(this.base)

            return `${created}-${updated ?? this.placeholder}-${deleted}`.toUpperCase() as _ttid
        }

        if(_id && this.isTTID(_id)) {

            const [created] = _id.split('-')

            const updated = time.toString(this.base)

            return `${created}-${updated}`.toUpperCase() as _ttid
        }

        if(_id && !this.isTTID(_id)) throw new Error("Invalid TTID!")

        const timeCode = time.toString(this.base)

        return timeCode.toUpperCase() as _ttid
    }

    static decodeTime(_id: string) {

        if(!this.isTTIDFormat(_id)) throw new Error(`Invalid Format!`)

        const [created, updated, deleted] = _id.split('-')

        const convertToMilliseconds = (timeCode: string) => Number((parseInt(timeCode, this.base) / this.multiple).toFixed(0))

        const timestamps: _timestamps = {
            createdAt: convertToMilliseconds(created)
        }

        if(updated && updated !== this.placeholder) timestamps.updatedAt = convertToMilliseconds(updated)
        if(deleted) timestamps.deletedAt = convertToMilliseconds(deleted)

        return timestamps
    }
}                                      