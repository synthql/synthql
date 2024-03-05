/**
 * Deletes from the `value` object at the path given by `path`.
 * 
 * Example:
 * 
 * ```ts
 * const value = {
 *    a: {
 *       b: [1, 2, 3]
 *   }
 * }
 * 
 * const deleted = deleteAt(value, ['a', 'b'])
 * 
 * console.log(updated) // { a: { b: [1, 3, 3] } }
 * ```
 */
export function deleteAt<TRow>(value: TRow, path: Array<string | number>): void {
    if (path.length === 0) {
        return;
    }

    const queue: Array<{
        nestedValue: unknown,
        pathIndex: number
    }> = [{ nestedValue: value, pathIndex: 0 }];

    while (queue.length > 0) {
        const { nestedValue, pathIndex } = queue.shift()!;
        const key = path[pathIndex]

        const isLastIndex = pathIndex === path.length - 1;

        if (typeof key === 'number') {
            if (!Array.isArray(nestedValue)) {
                throw new Error(`Expected an array at path: ${JSON.stringify(path.slice(0, pathIndex))}`)
            }
            if (isLastIndex) {
                nestedValue.splice(key, 1);
            }
            else {
                queue.push({ nestedValue: nestedValue[key], pathIndex: pathIndex + 1 })
            }
        }
        else if (typeof key === 'string') {
            if (typeof nestedValue !== 'object' || nestedValue === null || nestedValue === undefined || Array.isArray(nestedValue) || !(hasKey(nestedValue, key))) {
                throw new Error(`Expected an object at path: ${JSON.stringify(path.slice(0, pathIndex))}`)
            }

            if (isLastIndex) {
                delete nestedValue[key];
            }
            else {
                queue.push({ nestedValue: nestedValue[key], pathIndex: pathIndex + 1 })
            }
        }
    }
}


function hasKey<T extends string>(obj: {}, key: T): obj is { [k in T]: unknown } {
    return key in obj;
}