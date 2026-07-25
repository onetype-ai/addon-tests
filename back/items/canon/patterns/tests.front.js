// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('canon.patterns', (patterns) =>
{
    patterns.Item({
        id: 'tests.front',
        description: 'A front test file wraps one tests.front.Item in AddonReady, and what the test registers to prove its point is the test speaking.',
        match: '/items/tests/front/[^/]+\\.js$',
        claims: '/items/tests/front/',
        pattern: 'onetype.AddonReady(\'tests.front\', (tests) =>\n{\n    tests.Item({ __fields__ });\n});',
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
                description: 'The test itself, handed a page of its own and free to be async.'
            },
            url: {
                type: 'string',
                description: 'Where the page believes it is, defaulting to http://localhost/.'
            },
            skip: {
                type: 'string',
                description: 'Why the test does not run.'
            }
        }
    });
});
