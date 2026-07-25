// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.back.Fn('get.tools', function(failed, connection = 'primary')
{
    this.database = () =>
    {
        const database = onetype.AddonGet('database');
        const item = database ? database.ItemGet(connection) : null;

        return item ? item.Get('connection') : null;
    };

    return {
        assert: tests.Fn('get.assert', failed),
        database: this.database()
    };
});
