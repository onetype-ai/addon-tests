// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

onetype.AddonReady('database', (database) =>
{
    database.ItemOn('add', (item) =>
    {
        const connection = tests.back.StoreGet('connection');

        connection && item.Set('connection', connection);
    });
});
