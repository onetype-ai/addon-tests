// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.back', (tests) =>
{
    tests.Item({
        id: 'back/counts',
        addon: 'tests',
        description: 'The floor a package answers to rises with its size, each side counted apart, and the tests proving a package never count as the package.',
        callback: function({ assert })
        {
            this.root = onetype.AddonGet('tests');
            this.here = new URL('../../../..', import.meta.url).pathname;

            this.bands = () =>
            {
                const asked = (lines) =>
                {
                    return this.root.Fn('get.wanted', lines);
                };

                assert.equal(asked(0), 0, 'nothing asks for nothing');
                assert.equal(asked(49), 0, 'just under fifty still asks for nothing');
                assert.equal(asked(50), 1, 'fifty asks for one');
                assert.equal(asked(199), 1, 'just under two hundred still asks for one');
                assert.equal(asked(200), 2, 'two hundred asks for two');
                assert.equal(asked(1000), 2, 'a thousand still asks for two');
                assert.equal(asked(1001), 5, 'past a thousand asks for five');
                assert.equal(asked(5000), 5, 'five thousand still asks for five');
                assert.equal(asked(5001), 10, 'past five thousand asks for ten');
            };

            this.sides = () =>
            {
                const back = this.root.Fn('get.lines', this.here, 'back');
                const front = this.root.Fn('get.lines', this.here, 'front');

                assert.truthy(back > 0, 'the back of this package counts its lines');
                assert.equal(front, 0, 'a side that does not exist counts nothing');
            };

            this.apart = () =>
            {
                const written = this.root.Fn('get.written', this.here, 'back');
                const lines = this.root.Fn('get.lines', this.here, 'back');

                assert.truthy(written >= this.root.Fn('get.wanted', lines), 'this package answers its own floor');
                assert.truthy(this.root.Fn('get.written', this.here, 'front'), 'each side counts the tests written for it');
            };

            this.elsewhere = () =>
            {
                const absent = '/tmp/no-package-of-any-kind-lives-here';

                assert.equal(this.root.Fn('get.lines', absent, 'back'), 0, 'a path with no package counts nothing');
                assert.equal(this.root.Fn('get.written', absent, 'back'), 0, 'and carries no tests either');
            };

            this.registered = () =>
            {
                const reach = onetype.AddonGet('canon.reach');

                if(!reach)
                {
                    return;
                }

                assert.truthy(reach.ItemGet('tests'), 'the floor rides on canon reach');
                assert.truthy(onetype.AddonGet('canon.patterns').ItemGet('tests.back'), 'the back pattern claims its folder');
                assert.truthy(onetype.AddonGet('canon.patterns').ItemGet('tests.front'), 'the front pattern claims its folder');
            };

            this.bands();
            this.sides();
            this.apart();
            this.elsewhere();
            this.registered();
        }
    });
});
