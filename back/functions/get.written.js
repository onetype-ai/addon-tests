// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import tests from '#tests/back/addon.js';

tests.Fn('get.written', function(root)
{
    this.files = () =>
    {
        const base = join(root, 'tests');

        return existsSync(base) ? onetype.assets.read(base) : [];
    };

    this.counted = (file) =>
    {
        const found = readFileSync(file, 'utf8').match(/tests\.(back|front)\.Item\(/g);

        return found ? found.length : 0;
    };

    return this.files().reduce((total, file) => total + this.counted(file), 0);
});
