// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('get.actions', function(page)
{
    this.settle = () =>
    {
        return this.Fn('do.settle', page);
    };

    this.act = async (expression) =>
    {
        const value = page.eval(expression);

        this.settle();

        await new Promise((ready) => setTimeout(ready, 0));

        return value;
    };

    this.reach = (selector) =>
    {
        return 'var node = document.querySelector(' + JSON.stringify(selector) + ');'
            + ' if(!node) { throw new Error("No node matches " + ' + JSON.stringify(selector) + ' + "."); }';
    };

    this.run = (callback, ...args) =>
    {
        return this.act('(' + callback.toString() + ')(' + args.map((value) => JSON.stringify(value)).join(', ') + ');');
    };

    this.mount = (markup, data = {}) =>
    {
        return this.act(this.Fn('get.mount', markup, data));
    };

    this.click = (selector) =>
    {
        return this.act('(function(){ ' + this.reach(selector) + ' node.click(); })();');
    };

    this.type = (selector, value) =>
    {
        return this.act('(function(){ ' + this.reach(selector)
            + ' node.value = ' + JSON.stringify(value) + ';'
            + ' node.dispatchEvent(new Event("input", { bubbles: true }));'
            + ' node.dispatchEvent(new Event("change", { bubbles: true })); })();');
    };

    this.visit = (path) =>
    {
        return this.act('(function(){ history.pushState({}, "", ' + JSON.stringify(path) + ');'
            + ' window.dispatchEvent(new Event("popstate")); })();');
    };

    this.back = () =>
    {
        return this.act('history.back();');
    };

    return {
        run: this.run,
        mount: this.mount,
        click: this.click,
        type: this.type,
        visit: this.visit,
        back: this.back,
        settle: this.settle
    };
});
