// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.patterns', (patterns) =>
{
    patterns.Item({
        id: 'tests.back',
        description: 'A back test file wraps one tests.back.Item in AddonReady, and what the test registers to prove its point is the test speaking.',
        match: '/items/tests/back/[^/]+\\.js$',
        claims: '/items/tests/back/',
        pattern: 'onetype.AddonReady(\'tests.back\', (tests) =>\n{\n    tests.Item({ __fields__ });\n});',
        fields: {
            id: {
                type: 'string',
                required: true,
                description: 'The test id, the side folder and the file spelling it.'
            },
            addon: {
                type: 'string',
                required: true,
                description: 'The addon the test covers.'
            },
            description: {
                type: 'string',
                required: true,
                description: 'What the test proves, one sentence read as the report line.'
            },
            callback: {
                type: 'function',
                required: true,
                description: 'The test itself, handed an assert and free to be async.'
            },
            skip: {
                type: 'string',
                description: 'Why the test does not run.'
            }
        }
    });
});
