// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.Fn('get.wanted', function(lines)
{
    if(lines < 100)
    {
        return 0;
    }

    if(lines < 200)
    {
        return 2;
    }

    if(lines <= 1000)
    {
        return 5;
    }

    return 10;
});
