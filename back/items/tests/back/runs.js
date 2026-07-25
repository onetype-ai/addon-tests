// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'tests:back/runs',
        addon: 'tests',
        description: 'Each side runs its own, the root walks both, an addon name narrows the run and a name nobody carries answers nothing.',
        callback: async function({ assert })
        {
            this.planted = () =>
            {
                tests.Item({
                    id: 'proof.on.the.back',
                    addon: 'tests.proving.runs',
                    description: 'Registered by a test to be picked by a test.',
                    callback: () => {}
                });

                onetype.AddonGet('tests.front').Item({
                    id: 'proof.on.the.front',
                    addon: 'tests.proving.runs',
                    description: 'Registered by a test to be picked by a test.',
                    callback: () => {}
                });
            };

            this.sides = async () =>
            {
                const back = await tests.run('tests.proving.runs');
                const front = await onetype.AddonGet('tests.front').run('tests.proving.runs');

                assert.equal(back.length, 1, 'the back run answers its own');
                assert.equal(back[0].id, 'proof.on.the.back', 'and only its own');
                assert.equal(front.length, 1, 'the front run answers its own');
                assert.equal(front[0].id, 'proof.on.the.front', 'and only its own');
            };

            this.both = async () =>
            {
                const walked = await onetype.AddonGet('tests').run('tests.proving.runs');
                const ids = walked.map((entry) => entry.id).sort().join(',');

                assert.equal(walked.length, 2, 'the root walks both sides');
                assert.equal(ids, 'proof.on.the.back,proof.on.the.front', 'and answers each of them once');
            };

            this.narrowed = () =>
            {
                const root = onetype.AddonGet('tests');
                const everything = root.Fn('get.picked', tests, null);
                const narrowed = root.Fn('get.picked', tests, 'tests.proving.runs');

                assert.truthy(everything.length > narrowed.length, 'a bare run covers more than a named one');
                assert.equal(narrowed.length, 1, 'and a named one covers what carries the name');
            };

            this.absent = async () =>
            {
                const nothing = await tests.run('nobody-covers-this');

                assert.equal(nothing.length, 0, 'a name nobody carries answers nothing');
            };

            this.planted();

            await this.sides();
            await this.both();
            await this.absent();

            this.narrowed();
        }
    });
});
