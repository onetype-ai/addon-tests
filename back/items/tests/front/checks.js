// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'tests:front/checks',
        addon: 'tests',
        description: 'Every dom check reads the page and names what it found against what the test wanted, and a page carries nothing the test before it left.',
        callback: async function({ mount, eval: read, assert })
        {
            this.holding = async () =>
            {
                await mount('<a id="link" href="/there" class="one">the word</a><a class="one">and another</a>');

                assert.text('#link', 'the word', 'text reads the node');
                assert.contains('#link', 'word', 'contains reads inside it');
                assert.exists('#link', 'exists finds it');
                assert.missing('#absent', 'missing does not');
                assert.count('.one', 2, 'count reaches every match');
                assert.attribute('#link', 'href', '/there', 'attribute reads what it carries');
            };

            this.clean = async () =>
            {
                const leaked = await read('document.body.getAttribute("data-left-behind")');

                assert.falsy(leaked, 'the page opened carrying nothing from before');

                await read('document.body.setAttribute("data-left-behind", "yes")');
            };

            await this.holding();
            await this.clean();
        }
    });
});
