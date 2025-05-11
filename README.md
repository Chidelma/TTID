# TTID (Time-Tagged Identifier)

A lightweight, time-based identifier generator that captures both creation and update timestamps.

## Overview

TTID creates unique identifiers with the following structure:
```
[CREATION_TIMESTAMP]-[BASE]-[UPDATE_TIMESTAMP]
```

Each TTID contains:
- A creation timestamp encoded in a variable base
- The base used for encoding (between 18 and 36)
- An update timestamp (initially identical to creation timestamp)

This format allows for:
- Guaranteed uniqueness due to high-resolution timestamps
- The ability to track when an ID was created and last updated
- Efficient encoding with variable base to reduce string length

## Installation

```bash
npm install ttid
```

## Usage

### Basic Usage

```typescript
import TTID from 'ttid';

// Generate a new TTID
const id = TTID.generate();
console.log(id);
// Example output: "143GV1-23-143GV1"

// Verify if a string is a valid TTID
const isValid = TTID.isULID(id);
console.log(isValid); // true

// Update an existing TTID (updates the timestamp portion)
const updatedId = TTID.update(id);
console.log(updatedId);
// Example output: "143GV1-23-143JB5"
```

### Decoding Timestamps

```typescript
import TTID from 'ttid';

// Generate a TTID
const id = TTID.generate();
console.log(id); // "143KP2-25-143KP2"

// Wait a few seconds
setTimeout(() => {
  // Update the TTID
  const updatedId = TTID.update(id);
  console.log(updatedId); // "143KP2-25-143LQ8"
  
  // Decode the timestamps
  const times = TTID.decodeTime(updatedId);
  console.log(times);
  // Example output: 
  // {
  //   createdAt: 1651234567890,
  //   updatedAt: 1651234572345
  // }
  
  // Convert to readable dates
  console.log({
    created: new Date(times.createdAt),
    updated: new Date(times.updatedAt)
  });
}, 5000);
```

### Type Checking

The package includes TypeScript type definitions:

```typescript
import TTID, { _ttid } from 'ttid';

// Type checking for TTID strings
function processId(id: _ttid) {
  // This function only accepts valid TTIDs
  return TTID.update(id);
}

// This works
const id = TTID.generate();
processId(id);

// This will cause a TypeScript error
processId("not-a-valid-id");
```

## API Reference

### `TTID.generate()`

Generates a new TTID.

**Returns:** `_ttid` - A string in the format `[CREATION_TIMESTAMP]-[BASE]-[UPDATE_TIMESTAMP]`

### `TTID.update(id: string)`

Updates the timestamp portion of an existing TTID.

**Parameters:**
- `id` - An existing TTID string

**Returns:** `_ttid` - A new TTID with the same creation timestamp but updated timestamp

**Throws:** Error if the input is not a valid TTID

### `TTID.decodeTime(id: string)`

Decodes the creation and update timestamps from a TTID.

**Parameters:**
- `id` - A TTID string

**Returns:** Object with the following properties:
- `createdAt` - The creation timestamp in milliseconds
- `updatedAt` - The update timestamp in milliseconds

**Throws:** Error if the input is not a valid TTID

### `TTID.isULID(id: string)`

Checks if a string is a valid TTID.

**Parameters:**
- `id` - A string to check

**Returns:** `boolean` - `true` if the string is a valid TTID, `false` otherwise

### `TTID.isUUID(id: string)`

Checks if a string is a valid UUID.

**Parameters:**
- `id` - A string to check

**Returns:** `boolean` - `true` if the string is a valid UUID, `false` otherwise

## How It Works

1. The `generate()` method creates a high-resolution timestamp using `performance.now()` and `performance.timeOrigin`
2. This timestamp is multiplied by 10,000 to ensure uniqueness
3. A variable base is calculated (between 18 and 36) based on the timestamp digits
4. The timestamp is converted to a string representation in the calculated base
5. The ID is constructed as `[ENCODED_TIMESTAMP]-[BASE]-[ENCODED_TIMESTAMP]`

When `update()` is called:
1. The creation timestamp and base are preserved
2. A new timestamp is generated and encoded using the same base
3. The ID is updated to `[ORIGINAL_ENCODED_TIMESTAMP]-[BASE]-[NEW_ENCODED_TIMESTAMP]`

## Comparison with Other ID Systems

| Feature | TTID | UUID | ULID |
|---------|------|------|------|
| Time-based | ✅ | ❌ (v1, v4) / ✅ (v7) | ✅ |
| Tracks updates | ✅ | ❌ | ❌ |
| Sortable | ✅ | ❌ | ✅ |
| Random component | ❌ | ✅ | ✅ |
| Fixed format | ❌ | ✅ | ✅ |
| Binary efficiency | ⚠️ | ✅ | ✅ |

## Use Cases

- Database records that need to track both creation and modification times
- Distributed systems where update history matters
- Systems that need to efficiently encode ID information without relying on database lookups
- Applications where IDs need to be human-readable but still unique

## License

MIT