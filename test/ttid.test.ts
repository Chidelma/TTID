import TTID from "../src";
import { test, expect, describe } from 'bun:test'

describe("TTID", () => {

    test("Generate", () => {

        const _id = TTID.generate()

        const [created, base, updated] = _id.split('-')

        const { createdAt, updatedAt } = TTID.decodeTime(_id)

        expect(Number(base)).toBeGreaterThanOrEqual(18)
        expect(Number(base)).toBeLessThanOrEqual(36)
        expect(created).toEqual(updated)
        expect(TTID.isTTID(_id)).not.toBeNull()
        expect(TTID.isUUID(_id)).toBeNull()
        expect(TTID.isUUID(Bun.randomUUIDv7())).not.toBeNull()
        expect(typeof createdAt).toBe('number')
        expect(typeof updatedAt).toBe('number')
        expect(createdAt).toEqual(updatedAt)
    })

    test("Update", async () => {

        const _id = TTID.generate()
        await Bun.sleep(1000)
        const _newId = TTID.update(_id)

        const [created, base, updated] = _newId.split('-')

        const { createdAt, updatedAt } = TTID.decodeTime(_newId)

        expect(Number(base)).toBeGreaterThanOrEqual(18)
        expect(Number(base)).toBeLessThanOrEqual(36)
        expect(created).not.toEqual(updated)
        expect(TTID.isTTID(_newId)).not.toBeNull()
        expect(TTID.isUUID(_newId)).toBeNull()
        expect(_id).not.toEqual(_newId)
        expect(typeof createdAt).toBe('number')
        expect(typeof updatedAt).toBe('number')
        expect(createdAt).not.toEqual(updatedAt)
        expect(updatedAt).toBeGreaterThan(createdAt)
    })
})