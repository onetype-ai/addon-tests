// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.back.FnExpose('run', async function(addon = null)
{
    this.wanted = () =>
    {
        return Object.values(this.Items()).filter((item) =>
        {
            return addon ? item.Get('addon') === addon : true;
        });
    };

    this.once = async (item) =>
    {
        const failed = [];
        const built = this.Fn('get.database');

        try
        {
            return await tests.Fn('run.one', item, this.Fn('get.tools', failed, built), failed);
        }
        finally
        {
            built && await built.knex.destroy();
        }
    };

    const results = [];

    for(const item of this.wanted())
    {
        results.push(await this.once(item));
    }

    return results;
});
