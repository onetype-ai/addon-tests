// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import tests from '#tests/back/addon.js';

tests.Fn('get.lines', function(root)
{
    this.files = (side) =>
    {
        const base = join(root, side);

        return existsSync(base) ? onetype.assets.read(base) : [];
    };

    this.counted = (file) =>
    {
        return readFileSync(file, 'utf8').split('\n').length;
    };

    const written = this.files('back').concat(this.files('front'));
    const proving = this.files('tests');

    return written.filter((file) => !proving.includes(file)).reduce((total, file) => total + this.counted(file), 0);
});
