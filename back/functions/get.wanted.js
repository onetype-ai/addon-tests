// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.Fn('get.wanted', function(lines)
{
    const bands = [[50, 0], [200, 1], [1001, 2], [5001, 5]];
    const band = bands.find((entry) => lines < entry[0]);

    return band ? band[1] : 10;
});
