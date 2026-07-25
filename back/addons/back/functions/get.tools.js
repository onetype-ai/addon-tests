// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.back.Fn('get.tools', function(failed, built)
{
    return {
        assert: tests.Fn('get.assert', failed),
        database: built ? built.knex : null
    };
});
