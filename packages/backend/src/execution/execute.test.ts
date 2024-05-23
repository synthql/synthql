import { describe, expect, test } from 'vitest';
import { execute } from './execute';
import { DB, schema } from '../tests/generated';
import { QueryProviderExecutor } from './executors/QueryProviderExecutor';
import { collectLast } from '..';
import { col, query } from '@synthql/queries';
import { ColumnDataTypes } from '../tests/getColumnDataTypes';
import { PgCatalogInt4, PgCatalogText } from '../tests/generated/db';

interface DbWithVirtualTables extends DB {
    film_rating: {
        columns: {
            film_id: {
                type: PgCatalogInt4;
                selectable: true;
                includable: false;
                whereable: true;
                nullable: false;
                isPrimaryKey: true;
            };

            rating: {
                type: PgCatalogText;
                selectable: true;
                includable: false;
                whereable: false;
                nullable: false;
                isPrimaryKey: false;
            };
        };
    };
}

const schemaWithVirtualTables = {
    properties: {
        ...schema.properties,
        film_rating: {
            properties: {
                columns: {
                    properties: {
                        film_id: {
                            properties: {
                                selectable: {
                                    type: 'boolean',
                                    const: true,
                                },
                            },
                        },
                        rating: {
                            properties: {
                                selectable: {
                                    type: 'boolean',
                                    const: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

const from = query<DbWithVirtualTables>(schemaWithVirtualTables).from;
const defaultSchema = 'public';

describe('execute', () => {
    const actorProvider = new QueryProviderExecutor<DbWithVirtualTables>([
        {
            table: 'actor',
            execute: async (q) => {
                const actorId = q.where?.actor_id;
                return [
                    { actor_id: 1, first_name: 'John', last_name: 'Doe' },
                    { actor_id: 2, first_name: 'Jane', last_name: 'Doe' },
                    { actor_id: 3, first_name: 'John', last_name: 'Smith' },
                ].filter((a) => (actorId ? a.actor_id === actorId : true));
            },
        },
    ]);

    const filmProvider = new QueryProviderExecutor<DbWithVirtualTables>([
        {
            table: 'film',
            execute: async (q) => {
                const films: Array<
                    Pick<
                        ColumnDataTypes<DbWithVirtualTables['film']['columns']>,
                        'film_id' | 'title'
                    >
                > = [
                    {
                        film_id: 1,
                        title: 'The Matrix',
                    },
                    {
                        film_id: 2,
                        title: 'The Matrix Reloaded',
                    },
                    {
                        film_id: 3,
                        title: 'The Matrix Revolutions',
                    },
                    {
                        film_id: 4,
                        title: 'The Fifth element',
                    },
                ];

                const filmId = q.where?.film_id;
                return films.filter((a) =>
                    filmId ? a.film_id === filmId : true,
                );
            },
        },
    ]);

    const filmRatingProvider = new QueryProviderExecutor<DbWithVirtualTables>([
        {
            table: 'film_rating',
            execute: async (q) => {
                const filmRatings: Array<
                    Pick<
                        ColumnDataTypes<
                            DbWithVirtualTables['film_rating']['columns']
                        >,
                        'film_id' | 'rating'
                    >
                > = [
                    {
                        film_id: 1,
                        rating: 'PG-13',
                    },
                    {
                        film_id: 2,
                        rating: 'R',
                    },
                    {
                        film_id: 3,
                        rating: 'R',
                    },
                    {
                        film_id: 4,
                        rating: 'PG-13',
                    },
                ];
                const filmIds = q.where?.film_id.in;
                return filmRatings.filter((a) =>
                    filmIds ? filmIds.includes(a.film_id) : true,
                );
            },
        },
    ]);

    test('single provider', async () => {
        const q = from('actor')
            .columns('actor_id', 'first_name', 'last_name')
            .groupingId('actor_id')
            .where({ actor_id: 1 })
            .one();

        const result = await collectLast(
            execute<DbWithVirtualTables, typeof q>(q, {
                executors: [actorProvider],
                defaultSchema,
            }),
        );

        expect(result).toEqual({
            actor_id: 1,
            first_name: 'John',
            last_name: 'Doe',
        });
    });

    test('film with film_rating', async () => {
        function findFilmWithRating(filmId: number) {
            return from('film')
                .columns('film_id', 'title')
                .groupingId('film_id')
                .where({ film_id: filmId })
                .include({
                    rating: from('film_rating')
                        .columns('rating')
                        .where({ film_id: col('film.film_id') })
                        .one(),
                })
                .one();
        }

        const q = findFilmWithRating(1);

        const result = await collectLast(
            execute<DbWithVirtualTables, typeof q>(q, {
                executors: [filmProvider, filmRatingProvider],
                defaultSchema,
            }),
        );

        expect(result).toMatchObject({
            film_id: 1,
            title: 'The Matrix',
            rating: {
                rating: 'PG-13',
            },
        });

        const q2 = findFilmWithRating(2);

        const result2 = await collectLast(
            execute<DbWithVirtualTables, typeof q2>(q2, {
                executors: [filmProvider, filmRatingProvider],
                defaultSchema,
            }),
        );

        expect(result2).toMatchObject({
            film_id: 2,
            title: 'The Matrix Reloaded',
            rating: {
                rating: 'R',
            },
        });
    });
});
