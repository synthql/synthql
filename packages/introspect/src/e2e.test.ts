import { describe, expect, test } from 'vitest';
import { generate } from '.';
import * as prettier from 'prettier';

describe('e2e', () => {
    test.skip('Generate from luminovo', async () => {
        const prettierOptions = await prettier.resolveConfig(
            '../../.prettier.config.js',
        );

        expect(prettierOptions).not.toBe(null);

        await generate({
            connectionString:
                'postgresql://epibator:TempEpibatorPass@localhost:5432/epibator',
            includeSchemas: ['public', 'luminovo', 'types'],
            defaultSchema: 'public',
            outDir: './build/foo',
            formatter: (str) =>
                prettier.format(str, {
                    parser: 'typescript',
                    ...prettierOptions,
                }),
        });
    }, 60_000);

    test('Generate from Pagila', async () => {
        const prettierOptions = await prettier.resolveConfig(
            '../../.prettier.config.js',
        );

        expect(prettierOptions).not.toBe(null);

        // Generate in `queries` package
        await generate({
            connectionString:
                'postgresql://postgres:postgres@localhost:5432/postgres',
            includeSchemas: ['public'],
            defaultSchema: 'public',
            outDir: '../queries/src/generated',
            formatter: (str) =>
                prettier.format(str, {
                    parser: 'typescript',
                    ...prettierOptions,
                }),
            SECRET_INTERNALS_DO_NOT_USE_queriesImportLocation: '../query',
        });

        // Generate in `backend` package
        await generate({
            connectionString:
                'postgresql://postgres:postgres@localhost:5432/postgres',
            includeSchemas: ['public'],
            defaultSchema: 'public',
            outDir: '../backend/src/tests/generated',
            formatter: (str) =>
                prettier.format(str, {
                    parser: 'typescript',
                    ...prettierOptions,
                }),
        });

        // Generate in `react` package
        await generate({
            connectionString:
                'postgresql://postgres:postgres@localhost:5432/postgres',
            includeSchemas: ['public'],
            defaultSchema: 'public',
            outDir: '../react/src/test/generated',
            formatter: (str) =>
                prettier.format(str, {
                    parser: 'typescript',
                    ...prettierOptions,
                }),
        });
    }, 100_000);
});
