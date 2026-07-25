// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('get.network', function(routes)
{
    return `(function()
    {
        var routes = ${JSON.stringify(routes)};

        window.__requests = [];

        window.fetch = function(url, options)
        {
            var address = String(url);

            window.__requests.push({ url: address, options: options || {} });

            var match = Object.keys(routes).find(function(key){ return address.indexOf(key) !== -1; });
            var answer = match ? routes[match] : null;

            return Promise.resolve({
                ok: !!match,
                status: match ? 200 : 404,
                text: function(){ return Promise.resolve(typeof answer === 'string' ? answer : JSON.stringify(answer)); },
                json: function(){ return Promise.resolve(answer); }
            });
        };
    })();`;
});
