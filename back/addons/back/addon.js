// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests', (tests) =>
{
    tests.back = onetype.Addon('tests.back', (addon) =>
    {
        addon.Description('Holds the tests that run in the process, each handed the checks it needs and nothing else.');

        addon.Field('id', {
            type: 'string',
            required: true,
            description: 'Unique test id, the addon and what it proves, like commands.run.validates.'
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
            description: 'The test itself, called with an assert and free to be async.'
        });

        addon.Field('skip', {
            type: 'string',
            description: 'Why the test does not run, set to leave it out and say so in the report.'
        });
    });
});
