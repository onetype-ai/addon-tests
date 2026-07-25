// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'front/network',
        addon: 'tests',
        description: 'A page answers fetch from the routes the test named, records every call it took, and refuses the ones nobody claimed.',
        callback: async function({ network, eval: read, assert })
        {
            this.answered = async () =>
            {
                const status = await read('fetch("/api/thing").then(function(answer){ return answer.status; })');
                const fine = await read('fetch("/api/thing").then(function(answer){ return answer.ok; })');

                assert.equal(status, 200, 'a claimed route answers');
                assert.equal(fine, true, 'and reads as ok');
            };

            this.shaped = async () =>
            {
                const body = await read('fetch("/api/thing").then(function(answer){ return answer.json(); }).then(function(seen){ return seen.word; })');
                const text = await read('fetch("/api/plain").then(function(answer){ return answer.text(); })');

                assert.equal(body, 'given', 'json answers the object the route named');
                assert.equal(text, 'a plain string', 'text answers the string the route named');
            };

            this.refused = async () =>
            {
                const status = await read('fetch("/api/nobody").then(function(answer){ return answer.status; })');
                const fine = await read('fetch("/api/nobody").then(function(answer){ return answer.ok; })');

                assert.equal(status, 404, 'a route nobody claimed answers not found');
                assert.equal(fine, false, 'and does not read as ok');
            };

            this.recorded = async () =>
            {
                const taken = await read('JSON.stringify(window.__requests.map(function(entry){ return entry.url; }))');

                assert.match(taken, '/api/thing', 'the calls that were answered are recorded');
                assert.match(taken, '/api/nobody', 'and so are the ones that were not');
            };

            await network({
                '/api/thing': { word: 'given' },
                '/api/plain': 'a plain string'
            });

            await this.answered();
            await this.shaped();
            await this.refused();
            await this.recorded();
        }
    });
});
