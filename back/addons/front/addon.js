// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests', (tests) =>
{
    tests.front = onetype.Addon('tests.front', (addon) =>
    {
        addon.Description('Holds the tests that open a dom of their own, each handed a page carrying the real front bundle.');

        addon.Field('id', {
            type: 'string',
            required: true,
            description: 'Unique test id, the addon and what it proves, like directives.click.runs.'
        });

        addon.Field('addon', {
            type: 'string',
            required: true,
            description: 'The addon the test belongs to, so a run can cover one addon alone.'
        });

        addon.Field('description', {
            type: 'string',
            required: true,
            description: 'What the test proves, one sentence read as the report line.'
        });

        addon.Field('callback', {
            type: 'function',
            required: true,
            description: 'The test itself, called with a page of its own and free to be async.'
        });

        addon.Field('url', {
            type: 'string',
            value: 'http://localhost/',
            description: 'Where the page believes it is, the front reads it as the location.'
        });

        addon.Field('skip', {
            type: 'string',
            description: 'Why the test does not run, set to leave it out and say so in the report.'
        });
    });
});
