import TTID from "../src";
import { test, expect, describe } from 'bun:test'

describe("TTID", () => {

    test("Generate", () => {

        const _id = TTID.generate()

        console.log("Created", _id, _id.length)

        const { createdAt } = TTID.decodeTime(_id)

        expect(TTID.isTTID(_id)).toBeTrue()
        expect(TTID.isUUID(_id)).toBeNull()
        expect(TTID.isUUID(Bun.randomUUIDv7())).not.toBeNull()
        expect(typeof createdAt).toBe('number')
    })

    test("Update", async () => {

        const _id = TTID.generate()
        await Bun.sleep(1000)
        const _newId = TTID.generate(_id)

        console.log("Updated", _newId, _newId.length)

        const [created, updated] = _newId.split('-')

        const { createdAt, updatedAt } = TTID.decodeTime(_newId)

        expect(updated).not.toBeUndefined()
        expect(created).not.toEqual(updated)
        expect(TTID.isTTID(_newId)).toBeTrue()
        expect(TTID.isUUID(_newId)).toBeNull()
        expect(_id).not.toEqual(_newId)
        expect(typeof createdAt).toBe('number')
        expect(typeof updatedAt).toBe('number')
        expect(createdAt).not.toEqual(updatedAt)
        expect(updatedAt).not.toBeUndefined()
        expect(updatedAt).toBeGreaterThan(createdAt)
    })

    test('Created-Deleted', async () => {

        const _id = TTID.generate()
        await Bun.sleep(1000)
        const _newId = TTID.generate(_id, true)

        console.log("Created-Deleted", _newId, _newId.length)

        const [created, updated, deleted] = _newId.split('-')

        const { createdAt, updatedAt, deletedAt } = TTID.decodeTime(_newId)

        expect(updated).toEqual('X')
        expect(deleted).not.toBeUndefined()
        expect(created).not.toEqual(deleted)
        expect(TTID.isTTID(_newId)).toBeTrue()
        expect(TTID.isUUID(_newId)).toBeNull()
        expect(_id).not.toEqual(_newId)
        expect(typeof createdAt).toBe('number')
        expect(typeof deletedAt).toBe('number')
        expect(createdAt).not.toEqual(updatedAt)
        expect(updatedAt).toBeUndefined()
        expect(deletedAt).not.toBeUndefined()
        expect(deletedAt).toBeGreaterThan(createdAt)
    })

    test('Created-Updated-Deleted', async () => {

        const _id = TTID.generate()
        await Bun.sleep(1000)
        const _newId = TTID.generate(_id)
        await Bun.sleep(1000)
        const _deletedId = TTID.generate(_newId, true)

        console.log("Created-Updated-Deleted", _deletedId, _deletedId.length)

        const [created, updated, deleted] = _deletedId.split('-')

        const { createdAt, updatedAt, deletedAt } = TTID.decodeTime(_deletedId)
        
        expect(updated).not.toEqual('X')
        expect(deleted).not.toBeUndefined()
        expect(created).not.toEqual(deleted)
        expect(created).not.toEqual(updated)
        expect(updated).not.toEqual(deleted)
        expect(TTID.isTTID(_newId)).toBeTrue()
        expect(TTID.isUUID(_newId)).toBeNull()
        expect(_id).not.toEqual(_newId)
        expect(_newId).not.toEqual(_deletedId)
        expect(typeof createdAt).toBe('number')
        expect(typeof deletedAt).toBe('number')
        expect(typeof updatedAt).toBe("number")
        expect(createdAt).not.toEqual(updatedAt)
        expect(createdAt).not.toEqual(deletedAt)
        expect(updatedAt).not.toEqual(deletedAt)
        expect(updatedAt).not.toBeUndefined()
        expect(deletedAt).not.toBeUndefined()
        expect(deletedAt).toBeGreaterThan(createdAt)
        expect(updatedAt).toBeGreaterThan(createdAt)
    })
})