// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { readFileSync } from 'fs';
import tests from '#tests/back/addon.js';

tests.front.Fn('get.bundle', function()
{
    this.opening = (files) =>
    {
        return ['/index.js', '/addon.js']
            .map((ending) => files.find((file) => file.endsWith(ending)))
            .filter(Boolean);
    };

    this.sort = (files, folders) =>
    {
        const kept = files.filter((file) => !file.endsWith('.back.js'));
        const first = this.opening(kept);

        first.forEach((file) => kept.splice(kept.indexOf(file), 1));

        return {
            first: first,
            files: kept,
            folders: folders
        };
    };

    this.source = (file) =>
    {
        return readFileSync(file, 'utf8')
            .replace(/^import\s+.*?;?\s*$/gm, '')
            .replace(/^export\s+.*?;?\s*$/gm, '');
    };

    this.folders = () =>
    {
        return Object.values(onetype.assets.Items()).flatMap((item) => [].concat(item.Get('js')).filter(Boolean));
    };

    const sources = this.folders().flatMap((folder) => onetype.assets.read(folder, 'js', this.sort).map(this.source));

    return '(function(){\n' + sources.filter((source) => source.trim()).join('\n\n') + '\n})();';
});
