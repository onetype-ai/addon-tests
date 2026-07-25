// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.Fn('get.assert', function(failed)
{
    this.fail = (message) =>
    {
        failed.push(message);
    };

    this.shown = (value) =>
    {
        return typeof value === 'string' ? value : JSON.stringify(value);
    };

    return {
        equal: (actual, expected, note = '') =>
        {
            actual === expected || this.fail(this.shown(note || 'value') + ' reads ' + this.shown(actual) + ', the test expects ' + this.shown(expected) + '.');
        },
        truthy: (value, note = 'value') =>
        {
            value || this.fail(note + ' is ' + this.shown(value) + ', the test expects something truthy.');
        },
        falsy: (value, note = 'value') =>
        {
            value && this.fail(note + ' is ' + this.shown(value) + ', the test expects nothing truthy.');
        },
        match: (haystack, needle, note = 'text') =>
        {
            String(haystack).includes(needle) || this.fail(note + ' reads ' + this.shown(haystack) + ', the test looks for ' + this.shown(needle) + '.');
        },
        throws: async (callback, note = 'the call') =>
        {
            try
            {
                await callback();
                this.fail(note + ' returned, the test expects it to throw.');
            }
            catch(error)
            {
                error.silent = true;
            }
        }
    };
});
