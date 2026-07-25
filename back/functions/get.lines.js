// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import tests from '#tests/back/addon.js';

tests.Fn('get.lines', function(root, side)
{
    this.counted = (file) =>
    {
        return readFileSync(file, 'utf8').split('\n').length;
    };

    const base = join(root, side);

    if(!existsSync(base))
    {
        return 0;
    }

    return onetype.assets.read(base).reduce((total, file) => total + this.counted(file), 0);
});
