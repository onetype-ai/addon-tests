// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { join } from 'path';
import tests from '#tests/back/addon.js';

onetype.AddonReady('canon.reach', (reach) =>
{
    reach.Item({
        id: 'tests',
        description: 'Each side answers for itself, fifty lines asking one test, two hundred two, a thousand five, five thousand ten, the floor and never the target.',
        check: (root, alias, report) =>
        {
            const side = (name) =>
            {
                const lines = tests.Fn('get.lines', root, name);
                const wanted = tests.Fn('get.wanted', lines);
                const written = tests.Fn('get.written', root, name);

                if(written >= wanted)
                {
                    return;
                }

                report(join(root, name), lines + ' lines of ' + name + ' carry ' + written
                    + ' tests, the canon asks for ' + wanted + ' at the least.');
            };

            side('back');
            side('front');
        }
    });
});
