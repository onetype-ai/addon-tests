// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

onetype.AddonReady('tests.front', (tests) =>
{
    tests.Item({
        id: 'front/isolated',
        addon: 'tests',
        description: 'The test running after another opens on a page of its own, holding neither the nodes nor the flags the one before it left.',
        callback: async function({ eval: read, assert })
        {
            assert.falsy(await read('document.body.getAttribute("data-left-behind")'), 'the flag did not cross');
            assert.falsy(await read('document.querySelector("#link")'), 'and neither did the markup');
            assert.equal(await read('location.href'), 'http://localhost/', 'the url opened where it always does');
        }
    });
});
