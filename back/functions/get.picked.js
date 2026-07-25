// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.Fn('get.picked', function(side, addon)
{
    return Object.values(side.Items()).filter((item) =>
    {
        return addon ? item.Get('addon') === addon : true;
    });
});
