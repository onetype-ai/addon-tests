# Tests

Tests is the proof that the rest still works. A test is a registered item like everything else in OneType: it names the addon it covers, says in one sentence what it proves, and carries a callback that either passes or reports why not. Back tests run in the process they are written in. Front tests get a DOM of their own, with the real front bundle inside it, so a directive, an element, a click or a whole login flow can be proven without a browser.

- Package: `@onetype/addon-tests`, slug `onetype/addon/tests`
- Depends on: `onetype/addon/assets`, which knows how the front bundle is ordered. Supports `onetype/addon/database`, swapping it for a Postgres in memory when it is there. Uses `happy-dom` for the front page and `pg-mem` for the database.
- Sides: `back/` only — the front is tested from the back, not shipped to it

## A back test

```js
tests.back.Item({
    id: 'commands.run.validates',
    addon: 'commands',
    description: 'A command rejects input its schema does not allow.',
    callback: async function(test)
    {
        const result = await commands.run('greet', {});

        test.assert.equal(result.code, 400);
        test.assert.match(result.message, 'name');
    }
});
```

Nothing is mocked. The command is the real command, the envelope is the real envelope. `test.assert` offers `equal`, `truthy`, `falsy`, `match` and `throws`, and every failed assertion is collected rather than thrown, so one test reports everything wrong with it at once.

## A back test with a database

When `onetype/addon/database` is present every back test is handed `test.database`, a knex pointing at a Postgres held in memory. The registered connections are swapped to it before the test runs, so a command that reaches for the primary connection reaches the test one instead and never touches a real server.

```js
tests.back.Item({
    id: 'database.creates',
    addon: 'database',
    description: 'A row written through the addon comes back out.',
    callback: async function(test)
    {
        await test.database.schema.createTable('users', (table) =>
        {
            table.increments('id');
            table.string('name');
        });

        await test.database('users').insert({ name: 'Ana' });

        const rows = await test.database('users').select('*');

        test.assert.equal(rows.length, 1);
    }
});
```

It is a real engine, not a stand-in: a unique constraint throws on a duplicate, and Postgres syntax the addon leans on, `ILIKE` included, behaves as it does on a server. Each test gets its own database, so a table one test builds is gone by the next and the order they run in changes nothing.

Without the database addon `test.database` is `null` and everything else works as before.

## A front test

```js
tests.front.Item({
    id: 'directives.click',
    addon: 'directives',
    description: 'A click runs its handler and the dom follows.',
    callback: async function(page)
    {
        await page.run(() =>
        {
            const addon = onetype.Addon('clicker');

            addon.Render('subject', function()
            {
                this.bump = () => { this.count = this.count + 1; };

                return '<div><button ot-click="bump">go</button><span>{{ count }}</span></div>';
            });

            addon.Render('subject', { count: 0 }).Mount(document.querySelector('#app'));
        });

        await page.click('button');

        page.assert.text('span', '1');
    }
});
```

Every front test opens its own page: a DOM, the whole front bundle assembled from `onetype.assets`, and an empty `#app` to mount into. Nothing carries over between tests.

### What the page offers

| Doing | |
| --- | --- |
| `page.run(callback, ...args)` | Runs the callback inside the page. |
| `page.mount(markup, data)` | Renders markup into `#app` with the data behind it. |
| `page.click(selector)` | Clicks the node. |
| `page.type(selector, value)` | Types into the node and fires input and change. |
| `page.visit(path)` | Moves to a path and fires popstate. |
| `page.back()` | Goes back through history. |
| `page.network(routes)` | Answers fetch from a map of url to body, with no server. |

| Asking | |
| --- | --- |
| `page.assert.text(selector, expected)` | The node reads exactly this. |
| `page.assert.contains(selector, needle)` | The node holds this somewhere. |
| `page.assert.exists(selector)` | Something matches. |
| `page.assert.missing(selector)` | Nothing matches. |
| `page.assert.count(selector, expected)` | This many match. |
| `page.assert.attribute(selector, name, expected)` | The attribute reads this. |
| `page.assert.path(expected)` | The page sits at this path. |
| `page.dom()` and `page.eval(source)` | The raw way out, for whatever the helpers do not cover. |

### The callback crosses a boundary

`page.run` hands its callback to the page as source, so it arrives without anything it closed over. This works:

```js
await page.run((label) => { document.querySelector('#app').textContent = label; }, 'Hello');
```

This does not, because `label` never makes the trip:

```js
const label = 'Hello';

await page.run(() => { document.querySelector('#app').textContent = label; });
```

Arguments travel, closures do not.

## Running them

```js
const results = await tests.back.run();
const front = await tests.front.run('directives');
```

Called bare, a run covers every test it holds. Given an addon name, it covers that addon alone. Each result names the test, says whether it passed, and lists what failed:

```js
{
    id: 'commands.run.validates',
    addon: 'commands',
    description: 'A command rejects input its schema does not allow.',
    passed: false,
    failures: ['value reads 200, the test expects 400.'],
    error: null
}
```

A test that throws is caught: the run continues and the error lands in `error`. A test with `skip` set never runs and says so in its report, so a skipped test stays visible instead of quietly disappearing.

## What it cannot prove

There is no layout in the page, so `getBoundingClientRect` reads zero and anything that measures geometry — a flip animation, a resize handle, a sort by position — needs a real browser. Everything that is logic, markup, state, events or navigation is fair ground.

## Guarantees

- A test is an item, so the set is inspectable and every test names the addon it covers.
- Every failed assertion is collected, so one run tells you everything that is wrong.
- Each front test gets a fresh page and each back test a fresh database, so no test can be broken or saved by the one before it.
- A test never reaches a real server: the database is held in memory and the page answers fetch from what the test told it to.
