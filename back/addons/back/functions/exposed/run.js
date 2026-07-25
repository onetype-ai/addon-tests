// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.back.FnExpose('run', async function(addon = null)
{
    this.once = async (item) =>
    {
        const failed = [];

        return tests.Fn('get.report', item, this.Fn('get.tools', failed), failed);
    };

    const results = [];

    for(const item of tests.Fn('get.picked', this, addon))
    {
        results.push(await this.once(item));
    }

    return results;
});
