// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import { Window } from 'happy-dom';
import tests from '#tests/back/addon.js';

tests.front.Fn('get.page', function(url)
{
    this.window = () =>
    {
        return new Window({
            url: url,
            settings: {
                enableJavaScriptEvaluation: true,
                suppressInsecureJavaScriptEnvironmentWarning: true
            }
        });
    };

    this.frames = () =>
    {
        return 'window.__otFrames = [];'
            + ' window.requestAnimationFrame = function(callback){ window.__otFrames.push(callback); return window.__otFrames.length; };'
            + ' window.cancelAnimationFrame = function(){};';
    };

    this.shell = () =>
    {
        return '<!DOCTYPE html><html><head><script>' + this.frames() + '</script></head>'
            + '<body><script>' + this.Fn('get.bundle') + '</script></body></html>';
    };

    this.root = (page) =>
    {
        const root = page.document.createElement('div');

        root.setAttribute('id', 'app');
        page.document.body.appendChild(root);
    };

    const page = this.window();

    page.document.write(this.shell());
    this.root(page);

    return page;
});
