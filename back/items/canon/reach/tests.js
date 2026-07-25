// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

onetype.AddonReady('canon.reach', (reach) =>
{
    reach.Item({
        id: 'tests',
        description: 'A package under two hundred lines carries two tests, up to a thousand five, past that ten, the floor and never the target.',
        check: (root, alias, report) =>
        {
            const lines = tests.Fn('get.lines', root);
            const wanted = tests.Fn('get.wanted', lines);
            const written = tests.Fn('get.written', root);

            if(written >= wanted)
            {
                return;
            }

            report(root, lines + ' lines carry ' + written + ' tests, the canon asks for ' + wanted + ' at the least.');
        }
    });
});
