// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'back/asserts',
        addon: 'tests',
        description: 'Every check collects a sentence naming what it read and what it wanted, and a passing check says nothing at all.',
        callback: async function({ assert })
        {
            this.checked = (run) =>
            {
                const failed = [];

                run(onetype.AddonGet('tests').Fn('get.assert', failed));

                return failed;
            };

            this.quiet = () =>
            {
                const passing = this.checked((check) =>
                {
                    check.equal(1, 1, 'one');
                    check.truthy('yes', 'a string');
                    check.falsy(0, 'zero');
                    check.match('the whole thing', 'whole', 'text');
                });

                assert.equal(passing.length, 0, 'checks that hold collect nothing');
            };

            this.spoken = () =>
            {
                const broken = this.checked((check) =>
                {
                    check.equal(1, 2, 'one');
                    check.truthy(0, 'zero');
                    check.falsy(1, 'one');
                    check.match('abc', 'z', 'text');
                });

                assert.equal(broken.length, 4, 'every broken check collects');
                assert.match(broken[0], 'one reads 1, the test expects 2', 'equal names both sides');
                assert.match(broken[1], 'zero is 0', 'truthy names what it read');
                assert.match(broken[2], 'one is 1', 'falsy names what it read');
                assert.match(broken[3], 'text reads abc', 'match names the haystack');
            };

            this.unnamed = () =>
            {
                const broken = this.checked((check) => check.equal('a', 'b'));

                assert.match(broken[0], 'value reads a', 'a check with no note still speaks');
            };

            this.identity = () =>
            {
                const same = this.checked((check) => check.equal({ x: 1 }, { x: 1 }, 'two objects'));
                const nan = this.checked((check) => check.equal(NaN, NaN, 'two nans'));

                assert.equal(same.length, 1, 'equal compares identity, not shape');
                assert.equal(nan.length, 1, 'equal compares identity, so NaN never matches');
            };

            this.throwing = async () =>
            {
                const quiet = [];
                const noisy = [];

                await onetype.AddonGet('tests').Fn('get.assert', quiet).throws(() =>
                {
                    throw onetype.Error(500, 'Thrown so throws has something to catch.');
                });

                await onetype.AddonGet('tests').Fn('get.assert', noisy).throws(() => 'nothing thrown', 'the call');

                assert.equal(quiet.length, 0, 'a call that throws satisfies throws');
                assert.match(noisy[0], 'the call returned', 'a call that returns breaks it');
            };

            this.quiet();
            this.spoken();
            this.unnamed();
            this.identity();

            await this.throwing();
        }
    });
});
