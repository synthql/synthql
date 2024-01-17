import { describe, expect, test } from "vitest";
import { queryEngine } from "./queryEngine";
import { DB } from "./db"
import { findActorById, findCityById, movie } from "./queries";
import { collectFirst } from "../util/collectFirst";
import { Query, Table } from "../types";
import { sql } from "./postgres";


describe('select', () => {

    function run<TTable extends Table<DB>, T extends Query<DB, TTable>>(query: T) {
        return collectFirst(queryEngine.execute(query))
    }

    describe('select with depth of 1', () => {
        test.each(Array(100).fill(0).map((_, i) => i))('select an actor by ID %s ', async (actorId) => {
            const result = await run(findActorById(actorId))

            const expected = await sql`SELECT * FROM actor WHERE actor_id = ${actorId}`

            expect(result).toEqual(expected[0])
        })
    })


    describe(`select with depth of 2:
        city
            one(country)
    `, () => {
        test.each(Array(100).fill(0).map((_, i) => i))('select a city with one country by ID %s ', async (cityId) => {
            const result = await run(findCityById(cityId));
            const expected = await sql`
            select 
                city.*,
                jsonb_agg(co) #> '{0}' as country
            from city
            left join country co 
                on co.country_id = city.country_id
            where city.city_id = ${cityId}
            group by
                city.city_id`

            expect(result).toEqual(expected[0])
        })
    })

    describe(`select with depth of 2:
        film
            one(language)
            many(actors)
    `, async () => {

        test.each(Array(100).fill(0).map((_, i) => i))('select a film with one language and many actors by ID %s ', async (filmId) => {
            const result = await run(movie().where({ film_id: filmId }).maybe());

            const expected = await sql`

            select
                f.title,
                f.description,
                f.release_year,
                jsonb_agg(l.*) #> '{0}' as language,
                jsonb_agg(actor.*) as actors
            from film f
                left join language l on f.language_id = l.language_id
                left join film_actor on film_actor.film_id = f.film_id
                left join actor on actor.actor_id = film_actor.actor_id
            where f.film_id = ${filmId}
            group by f.film_id`


            expect(result).toEqual(expected[0])
        })
    })

})