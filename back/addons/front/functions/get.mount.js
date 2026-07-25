// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('get.mount', function(markup, data)
{
    return `(function()
    {
        var addon = onetype.Addon('tests.mount.' + Math.random().toString(36).slice(2));

        addon.Render('subject', function(){ return ${JSON.stringify(markup)}; });

        var render = addon.Render('subject', ${JSON.stringify(data)});

        document.querySelector('#app').innerHTML = '';
        render.Mount(document.querySelector('#app'));

        window.__subject = render;
    })();`;
});
