import { Path } from "../execution/types";
import { assertArrayAtPath } from "./assertArrayAtPath";
import { assertObject } from "./assertObject";
import { getIn } from "./getIn";

/**
 * Set the `value` object at the path given by `path` with the result of `updater`.
 * 
 * Example:
 * 
 * ```ts
 * const value = {
 *    a: {
 *       b: [{}, {}, {}]
 *   }
 * }
 * 
 * const updated = setIn(value, ['a', 'b', { type: 'anyIndex' },'c'], () => 'thing')
 * 
 * console.log(updated) // { a: { b: [ { c: 'thing' }, { c: 'thing' }, { c: 'thing' } ] } }
 * ```
 */
export function setIn<TTree>(tree: TTree, path: Path, getValue: (parent: unknown) => unknown): TTree {
    const slice = path.slice(0, path.length - 1);
    const parents = getIn(tree, slice)

    for (const parent of parents) {
        const child = getValue(parent);
        const lastSegment = path[path.length - 1];
        if (typeof lastSegment === 'number') {
            assertArrayAtPath(parent, slice);
            parent[lastSegment] = child;
        }
        else if (typeof lastSegment === 'string') {
            assertObject(parent, slice);
            parent[lastSegment] = child;
        }
        else if (typeof lastSegment === 'object' && lastSegment.type === "anyIndex") {
            assertArrayAtPath(parent, slice);
            for (let i = 0; i < parent.length; i++) {
                parent[i] = child;
            }
        }
        else {
            throw new Error(`Unknown path segment: ${JSON.stringify(lastSegment)}`)
        }
    }

    return tree;
}



