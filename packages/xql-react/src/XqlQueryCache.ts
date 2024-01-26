import { Query, QueryCache } from "@tanstack/react-query";

type QueryCacheConfig = ConstructorParameters<typeof QueryCache>[0];

export function createXqlQueryCache(opts: QueryCacheConfig) {
    return new XqlQueryCache(opts);
}

export function isXqlQuery(query: Query): boolean {
    return query.queryKey[0] === 'xql';
}

class XqlQueryCache extends QueryCache {
    add(query: Query<any, any, any, any>): void {
        super.add(query);
    }
}