// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { newDb } from 'pg-mem';
import tests from '#tests/back/addon.js';

tests.back.Fn('get.database', function()
{
    this.built = () =>
    {
        const memory = newDb();

        return {
            memory: memory,
            knex: memory.adapters.createKnex(0, { client: 'pg' })
        };
    };

    this.swap = (database, knex) =>
    {
        database.ItemOn('add', (item) => item.Set('connection', knex));

        Object.values(database.Items()).forEach((item) => item.Set('connection', knex));
    };

    const database = onetype.AddonGet('database');

    if(!database)
    {
        return null;
    }

    const built = this.built();

    this.swap(database, built.knex);

    return built;
});
