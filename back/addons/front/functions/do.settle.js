// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('do.settle', function(page)
{
    this.drain = () =>
    {
        return `(function()
        {
            var rounds = 0;

            while(window.__otFrames.length && rounds < 20)
            {
                var pending = window.__otFrames;

                window.__otFrames = [];
                rounds++;

                for(var index = 0; index < pending.length; index++)
                {
                    pending[index]();
                }
            }
        })();`;
    };

    page.eval(this.drain());
});
