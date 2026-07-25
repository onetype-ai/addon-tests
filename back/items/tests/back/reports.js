// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'tests:back/reports',
        addon: 'tests',
        description: 'A run answers one report per test naming what it covered, whether it held, what broke and what threw.',
        callback: async function({ assert })
        {
            this.ran = async (id, extra) =>
            {
                tests.Item(Object.assign({
                    id: id,
                    addon: 'tests.proving.reports',
                    description: 'Registered by a test to be run by a test.'
                }, extra));

                const answered = await tests.run('tests.proving.reports');

                return answered.find((entry) => entry.id === id);
            };

            this.passing = async () =>
            {
                const report = await this.ran('proof.holds', {
                    callback: function({ assert: check })
                    {
                        check.equal(1, 1, 'one');
                    }
                });

                assert.equal(report.passed, true, 'a test with nothing broken passes');
                assert.equal(report.failures.length, 0, 'and carries no failures');
                assert.equal(report.error, null, 'and no error');
                assert.equal(report.addon, 'tests.proving.reports', 'the report names the addon covered');
                assert.match(report.description, 'Registered by a test', 'and carries the sentence');
            };

            this.failing = async () =>
            {
                const report = await this.ran('proof.breaks', {
                    callback: ({ assert: check }) =>
                    {
                        check.equal(1, 2, 'first');
                        check.equal(3, 4, 'second');
                    }
                });

                assert.equal(report.passed, false, 'a test with a broken check fails');
                assert.equal(report.failures.length, 2, 'every broken check reaches the report');
                assert.equal(report.error, null, 'nothing threw');
            };

            this.throwing = async () =>
            {
                const report = await this.ran('proof.throws', {
                    callback: () =>
                    {
                        throw onetype.Error(500, 'The callback gave up.');
                    }
                });

                assert.equal(report.passed, false, 'a test that throws fails');
                assert.equal(report.error, 'The callback gave up.', 'the message reaches the report');
            };

            this.rejecting = async () =>
            {
                const report = await this.ran('proof.rejects', {
                    callback: function()
                    {
                        return Promise.reject(onetype.Error(500, 'The promise gave up.', {}, true));
                    }
                });

                assert.equal(report.passed, false, 'a rejected promise fails the same way');
                assert.equal(report.error, 'The promise gave up.', 'and the message still reaches the report');
            };

            this.skipping = async () =>
            {
                const report = await this.ran('proof.skips', {
                    skip: 'the reason it waits',
                    callback: () =>
                    {
                        throw onetype.Error(500, 'This must never run.');
                    }
                });

                assert.equal(report.skipped, 'the reason it waits', 'a skipped test reports why');
                assert.equal(report.passed, undefined, 'and claims neither pass nor fail');
            };

            await this.passing();
            await this.failing();
            await this.throwing();
            await this.rejecting();
            await this.skipping();
        }
    });
});
