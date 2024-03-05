import { RefOp, col } from "@synthql/queries";
import { AnyDb, AnyQuery } from "../../types";
import { mapQuery } from "../../util/mapQuery";
import { mapRefs } from "../../util/mapRefs";
import { ColumnRef, TableRef } from "../executors/PgExecutor/queryBuilder/refs";

/**
 * A `RefContext` maintains a record from reference IDs to their actual values. E.g. { 'person.id': [1,2] }
 * 
 * Example:
 * 
 * ```ts
 * from('films')
 *  .where({main_actor_id: col('actor.id')})
 *  .many()
 * ```
 * 
 * When this query is executed, the RefContext will be used to replace `col('actor.id')` with the values
 * contained in the `RefContext`.
 */
export interface RefContext {
    getValues(ref: ColumnRef): any[]
    addValues(ref: ColumnRef, ...values: any[]): any[]
    getColumns(): ColumnRef[]


    merge(other: RefContext): void;
    getEntries(): [ColumnRef, any[]][]
}

export function createRefContext(): RefContext {
    const refs = new Map<string, any[]>()
    const hash = (ref: ColumnRef) => `${ref.tableRef.schema}.${ref.tableRef.table}.${ref.column}`

    return {
        getValues(ref) {
            const hasedRef = hash(ref);
            if (!refs.has(hasedRef)) {
                refs.set(hasedRef, [])
            }
            return refs.get(hasedRef)!
        },
        addValues(ref, ...values) {
            const result = this.getValues(ref);
            result.push(...values);
            return result;
        },
        getColumns() {
            const keys = Array.from(refs.keys());
            return keys.map(key => {
                const [schema, table, column] = key.split('.');
                return new TableRef(schema, table).column(column)
            })
        },
        getEntries() {
            return Array.from(refs.entries()).map(([key, values]) => {
                const [schema, table, column] = key.split('.');
                return [new TableRef(schema, table).column(column), values]
            })
        },
        merge(other: RefContext) {
            for (const [ref, values] of other.getEntries()) {
                this.addValues(ref, ...values)
            }
            return this;
        }
    }
}

/**
 * Takes a query with references and resolves them to the actual values.
 * 
 * Example: find a person and their pets. 
 * 
 * ```ts
 * const pets = from('pet')
 *  .columns('id','title')
 *  .where({ owner_id: col('person.id')})
 *  .many()
 * 
 * const owner = from('person')
 *  .columns('id','name')
 *  .where({ id: userId })
 *  .include({ pets })
 *  .many()
 * ``` 
 *
 * The resolveReferences function would convert the pets query to:
 * 
 * ```ts
 * const pets = from('pet')
 *  .columns('id','title')
 *  .where({ owner_id: userId })
 *  .many()   
 * ```
 * 
 * @param query the query to resolve references for
 * @param refContext A record from reference IDs to their actual values. E.g. { 'person.id': [1,2] }
 */
export function resolveReferences(query: AnyQuery, refContext: RefContext, defaultSchema: string) {
    return {
        ...query,
        where: resolveReferencesInWhere(query.where, refContext, defaultSchema)
    }
}

function resolveReferencesInWhere(where: AnyQuery['where'], context: RefContext, defaultSchema: string) {
    return mapRefs(where, (ref) => {
        const referencedValues = context.getValues(ColumnRef.fromRefOp(ref, defaultSchema))
        return {
            in: referencedValues
        }
    })
}