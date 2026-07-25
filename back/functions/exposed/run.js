// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.FnExpose('run', async function(addon = null)
{
    const back = await tests.back.run(addon);
    const front = await tests.front.run(addon);

    return back.concat(front);
});
