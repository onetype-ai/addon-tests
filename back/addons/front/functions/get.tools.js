// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('get.tools', function(page, failed)
{
    this.dom = () =>
    {
        return page.document.querySelector('#app').innerHTML;
    };

    this.read = (expression) =>
    {
        return page.eval(expression);
    };

    this.network = (routes) =>
    {
        return page.eval(this.Fn('get.network', routes));
    };

    this.extras = () =>
    {
        return {
            dom: this.dom,
            eval: this.read,
            network: this.network,
            assert: this.Fn('get.checks', page, failed)
        };
    };

    return Object.assign(this.Fn('get.actions', page), this.extras());
});
