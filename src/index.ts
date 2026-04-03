export default class TTID {

    /**
     * Multiplier applied to high-resolution timestamps to preserve sub-millisecond
     * precision when encoding to base-36. A value of 10,000 gives ~0.1ms resolution.
     */
    private static readonly PRECISION = 10_000

    /**
     * Encoding base for timestamp segments. Base-36 uses digits 0–9 and letters A–Z,
     * yielding compact 11-character timestamps for current Unix millisecond values.
     */
    private static readonly BASE = 36

    /**
     * Segment placeholder used when an ID is deleted without a prior update,
     * preserving the three-segment TTID structure.
     */
    private static readonly PLACEHOLDER = 'X'

    /** Minimum accepted timestamp (ms since epoch): 2020-01-01T00:00:00.000Z */
    private static readonly MIN_TIMESTAMP_MS = 1_577_836_800_000

    /** Maximum accepted timestamp (ms since epoch): 2200-01-01T00:00:00.000Z */
    private static readonly MAX_TIMESTAMP_MS = 7_258_118_400_000

    /** Cached compiled regex for TTID format validation, avoiding repeated recompilation. */
    private static readonly TTID_PATTERN = /^[A-Z0-9]{11}(-[A-Z0-9]{1,11}){0,2}$/i

    /** Cached compiled regex for UUID format validation. */
    private static readonly UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    private static timeNow(): number {
        return (performance.now() + performance.timeOrigin) * this.PRECISION
    }

    /**
     * Checks whether a string is a valid TTID.
     * @param _id - The string to validate.
     * @returns The creation `Date` if valid, or `null` if not.
     */
    static isTTID(_id: string): Date | null {

        if (!this.TTID_PATTERN.test(_id)) return null

        try {
            const { createdAt, updatedAt, deletedAt } = this.decodeTime(_id)

            if (updatedAt !== undefined) new Date(updatedAt)
            if (deletedAt !== undefined) new Date(deletedAt)

            return new Date(createdAt)
        } catch {
            return null
        }
    }

    /**
     * Checks whether a string is a valid UUID (any version or variant).
     * @param _id - The string to validate.
     * @returns A `RegExpMatchArray` if valid, or `null` if not.
     */
    static isUUID(_id: string): RegExpMatchArray | null {
        return _id.match(this.UUID_PATTERN)
    }

    /**
     * Generates a new TTID or advances an existing one through its lifecycle.
     *
     * - No arguments: creates a new single-segment TTID.
     * - `_id` only: updates the TTID, producing a two-segment ID.
     * - `_id` + `del: true`: marks the TTID as deleted, producing a three-segment ID.
     *
     * @param _id - An existing TTID to update or delete. Omit to create a new one.
     * @param del - When `true`, marks the TTID as deleted.
     * @returns The new or advanced TTID.
     * @throws {Error} If `_id` is already deleted (three-segment) or is not a valid TTID.
     */
    static generate(_id?: string, del: boolean = false): _ttid {

        if (_id && this.isTTID(_id) && _id.split('-').length === 3) {
            throw new Error('This identifier can no longer be modified')
        }

        const time = this.timeNow()

        if (_id && this.isTTID(_id) && del) {

            const [created, updated] = _id.split('-')
            const deleted = time.toString(this.BASE)

            return `${created}-${updated ?? this.PLACEHOLDER}-${deleted}`.toUpperCase() as _ttid
        }

        if (_id && this.isTTID(_id)) {

            const [created] = _id.split('-')
            const updated = time.toString(this.BASE)

            return `${created}-${updated}`.toUpperCase() as _ttid
        }

        if (_id && !this.isTTID(_id)) throw new Error('Invalid TTID!')

        return time.toString(this.BASE).toUpperCase() as _ttid
    }

    /**
     * Decodes the timestamps embedded in a TTID.
     * @param _id - A valid TTID string.
     * @returns An object with `createdAt`, and optionally `updatedAt` and `deletedAt` (ms since epoch).
     * @throws {Error} If the format is invalid or any segment encodes an out-of-range timestamp.
     */
    static decodeTime(_id: string): _timestamps {

        if (!this.TTID_PATTERN.test(_id)) throw new Error('Invalid Format!')

        const [created, updated, deleted] = _id.split('-')

        const convertToMilliseconds = (timeCode: string): number => {
            const ms = Number((parseInt(timeCode, this.BASE) / this.PRECISION).toFixed(0))

            if (!isFinite(ms) || ms < this.MIN_TIMESTAMP_MS || ms > this.MAX_TIMESTAMP_MS) {
                throw new Error(`Timestamp out of valid range in segment: ${timeCode}`)
            }

            return ms
        }

        const timestamps: _timestamps = {
            createdAt: convertToMilliseconds(created)
        }

        if (updated && updated !== this.PLACEHOLDER) timestamps.updatedAt = convertToMilliseconds(updated)
        if (deleted) timestamps.deletedAt = convertToMilliseconds(deleted)

        return timestamps
    }
}
