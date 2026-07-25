// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.Fn('run.one', async function(item, tools, failed)
{
    this.named = () =>
    {
        return {
            id: item.Get('id'),
            addon: item.Get('addon'),
            description: item.Get('description')
        };
    };

    this.clean = (error) =>
    {
        return error ? false : failed.length === 0;
    };

    this.report = (error) =>
    {
        return Object.assign(this.named(), {
            passed: this.clean(error),
            failures: failed,
            error: error ? error.message : null
        });
    };

    this.skipped = () =>
    {
        return Object.assign(this.named(), { skipped: item.Get('skip') });
    };

    this.attempt = async () =>
    {
        try
        {
            await item.Get('callback').call(item, tools);

            return this.report(null);
        }
        catch(error)
        {
            error.silent = true;

            return this.report(error);
        }
    };

    return item.Get('skip') ? this.skipped() : this.attempt();
});
