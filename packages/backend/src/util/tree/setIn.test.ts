import { describe, expect, test } from "vitest";
import { setIn } from "./setIn";
import { Path, star } from "../../execution/types";

describe("setIn", (i) => {

    const thingToWrite = "!@#$"
    const cases: Array<{ input: any, path: Path, output: any }> = [
        {
            input: {},
            path: ['a'],
            output: { a: thingToWrite }
        },
        {
            input: { b: 1, a: 2 },
            path: ['a'],
            output: { b: 1, a: thingToWrite }
        },
        {
            input: [{}, {}, {}],
            path: [star, 'a'],
            output: [{ a: thingToWrite }, { a: thingToWrite }, { a: thingToWrite }]
        },
        {
            input: { a: { b: [1, 2, 3] } },
            path: ['a', 'b'],
            output: { a: { b: thingToWrite } }
        },
        {
            input: { a: { b: [1, 2, 3] } },
            path: ['a', 'b', 1],
            output: { a: { b: [1, thingToWrite, 3] } }
        },
        {
            input: { a: { b: [1, 2, 3] } },
            path: ['a', 'b', 3],
            output: { a: { b: [1, 2, 3, thingToWrite] } }
        },
        {
            input: [{ a: 1 }, { a: 2 }, { a: 3 }],
            path: [star, 'b'],
            output: [{ a: 1, b: thingToWrite }, { a: 2, b: thingToWrite }, { a: 3, b: thingToWrite }]
        },
        {
            input: [
                { a: [{ a: 1 }, { a: 2 }] },
                { a: [{ a: 3 }, { a: 4 }] }
            ],
            path: [star, 'a', star, 'b'],
            output: [
                { a: [{ a: 1, b: thingToWrite }, { a: 2, b: thingToWrite }] },
                { a: [{ a: 3, b: thingToWrite }, { a: 4, b: thingToWrite }] }
            ]
        },
        {
            input: [
                { a: [{ a: 1 }, { a: 2 }] },
                { a: [{ a: 3 }, { a: 4 }] }
            ],
            path: [star, 'a', star],
            output: [
                { a: [thingToWrite, thingToWrite] },
                { a: [thingToWrite, thingToWrite] }
            ]
        }
    ]

    test.each(cases)('setIn %p', ({ input, path, output }) => {
        const actual = setIn(structuredClone(input), path, (parent) => thingToWrite)
        expect(actual).toEqual(output)
    })
})