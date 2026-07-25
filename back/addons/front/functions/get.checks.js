// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

tests.front.Fn('get.checks', function(page, failed)
{
    this.fail = (message) =>
    {
        failed.push(message);
    };

    this.node = (selector) =>
    {
        return page.document.querySelector(selector);
    };

    this.text = (selector) =>
    {
        const node = this.node(selector);

        return node ? node.textContent.trim() : null;
    };

    return {
        text: (selector, expected) =>
        {
            const found = this.text(selector);

            found === expected || this.fail(selector + ' reads ' + JSON.stringify(found) + ', the test expects ' + JSON.stringify(expected) + '.');
        },
        contains: (selector, needle) =>
        {
            const found = this.text(selector);

            String(found).includes(needle) || this.fail(selector + ' reads ' + JSON.stringify(found) + ', the test looks for ' + JSON.stringify(needle) + '.');
        },
        exists: (selector) =>
        {
            this.node(selector) || this.fail(selector + ' matches nothing, the test expects it on the page.');
        },
        missing: (selector) =>
        {
            this.node(selector) && this.fail(selector + ' is on the page, the test expects it gone.');
        },
        count: (selector, expected) =>
        {
            const found = page.document.querySelectorAll(selector).length;

            found === expected || this.fail(selector + ' matches ' + found + ' nodes, the test expects ' + expected + '.');
        },
        attribute: (selector, name, expected) =>
        {
            const node = this.node(selector);
            const found = node ? node.getAttribute(name) : null;

            found === expected || this.fail(selector + ' carries ' + name + '=' + JSON.stringify(found)
                + ', the test expects ' + JSON.stringify(expected) + '.');
        },
        path: (expected) =>
        {
            const found = page.eval('location.pathname');

            found === expected || this.fail('The page sits at ' + found + ', the test expects ' + expected + '.');
        }
    };
});
