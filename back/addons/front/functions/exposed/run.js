// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.FnExpose('run', async function(addon = null)
{
    this.wanted = () =>
    {
        return Object.values(this.Items()).filter((item) =>
        {
            return addon ? item.Get('addon') === addon : true;
        });
    };

    this.tools = (page, failed) =>
    {
        return Object.assign(this.Fn('get.tools', page, failed), {
            assert: Object.assign(this.Fn('get.checks', page, failed), tests.Fn('get.assert', failed))
        });
    };

    this.once = async (item) =>
    {
        const failed = [];
        const page = this.Fn('get.page', item.Get('url'));

        try
        {
            return await tests.Fn('run.one', item, this.tools(page, failed), failed);
        }
        finally
        {
            page.close();
        }
    };

    const results = [];

    for(const item of this.wanted())
    {
        results.push(await this.once(item));
    }

    return results;
});
