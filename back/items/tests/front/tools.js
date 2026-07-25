// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'tests:front/tools',
        addon: 'tests',
        description: 'A front test opens on a page of its own carrying the real bundle, and every action it takes settles before the next line reads the dom.',
        callback: async function({ mount, run, click, type, visit, back, eval: read, dom, assert })
        {
            this.page = async () =>
            {
                assert.equal(await read('typeof window.onetype'), 'object', 'the bundle reached the page');
                assert.equal(await read('typeof document.querySelector("#app")'), 'object', 'the mount point stands');
                assert.equal(await read('location.href'), 'http://localhost/', 'the page believes the default url');
            };

            this.mounting = async () =>
            {
                await mount('<p id="first">one</p>');

                assert.text('#first', 'one', 'markup mounts');
                assert.match(dom(), 'one', 'and the dom reads back');

                await mount('<p id="second">two</p>');

                assert.missing('#first', 'a second mount clears the first');
                assert.text('#second', 'two', 'and stands in its place');
            };

            this.given = async () =>
            {
                await mount('<p id="shown">{{ word }}</p>', { word: 'given' });

                assert.text('#shown', 'given', 'data reaches the markup');
            };

            this.acting = async () =>
            {
                await mount('<button id="go" onclick="this.textContent = \'clicked\'">idle</button>');
                await click('#go');

                assert.text('#go', 'clicked', 'a click reaches the handler');

                await mount('<input id="field"><span id="echo"></span>');
                await run(() =>
                {
                    document.querySelector('#field').addEventListener('input', (event) =>
                    {
                        document.querySelector('#echo').textContent = event.target.value;
                    });
                });

                await type('#field', 'typed');

                assert.text('#echo', 'typed', 'typing fires the events a listener waits on');
            };

            this.refusing = async () =>
            {
                await mount('<p>nothing to click</p>');

                await assert.throws(() => click('#nowhere'), 'clicking what is not there');
            };

            this.travelling = async () =>
            {
                await visit('/somewhere');

                assert.path('/somewhere', 'visiting moves the page');

                await visit('/further');
                await back();

                assert.path('/somewhere', 'and history walks back');
            };

            this.carrying = async () =>
            {
                await mount('<p id="carried">idle</p>');
                await run((word) =>
                {
                    document.querySelector('#carried').textContent = word;
                }, 'handed over');

                assert.text('#carried', 'handed over', 'arguments cross into the page');
            };

            await this.page();
            await this.mounting();
            await this.given();
            await this.acting();
            await this.refusing();
            await this.travelling();
            await this.carrying();
        }
    });
});
