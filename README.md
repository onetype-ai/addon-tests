# Tests

Tests is the proof that the rest still works. A test is a registered item like everything else in OneType: it names the addon it covers, says in one sentence what it proves, and carries a callback that either passes or reports why not. Back tests run in the process they are written in. Front tests get a DOM of their own, with the real front bundle inside it, so a directive, an element, a click or a whole login flow can be proven without a browser.

- Package: `@onetype/addon-tests`, slug `onetype/addon/tests`
- Depends on: `onetype/addon/assets`, which knows how the front bundle is ordered. Supports `onetype/addon/database`, reading whatever connection it holds. Uses `happy-dom` for the front page.
- Sides: `back/` only — the front is tested from the back, not shipped to it

## A back test

```js
tests.back.Item({
    id: 'commands.run.validates',
    addon: 'commands',
    description: 'A command rejects input its schema does not allow.',
    callback: async function({ assert })
    {
        const result = await commands.run('greet', {});

        assert.equal(result.code, 400, 'code');
        assert.match(result.message, 'name', 'message');
    }
});
```

Nothing is mocked. The command is the real command, the envelope is the real envelope. `assert` offers `equal`, `truthy`, `falsy`, `match` and `throws`, and every failed assertion is collected rather than thrown, so one test reports everything wrong with it at once.

## A back test with a database

When `onetype/addon/database` is present every back test is handed `database`, the live knex of the connection registered as `primary`.

```js
tests.back.Item({
    id: 'database.creates',
    addon: 'database',
    description: 'A row written through the addon comes back out.',
    callback: async function({ assert, database })
    {
        await database('users').insert({ name: 'Ana' });

        const rows = await database('users').select('*');

        assert.equal(rows.length, 1, 'rows');
    }
});
```

Tests neither creates that connection nor changes it. The application decides what a run connects to, which makes a `tests.js` beside `index.js` the place to say so:

```js
import '@onetype/platform/server';
import database from '@onetype/addon-database';
import tests from '@onetype/addon-tests';

database.Item({
    id: 'primary',
    type: 'memory',
    onConnect: async (knex) => { /* seed, or clear */ }
});

await database.Fn('get.ready');

const results = await tests.back.run();
```

`type: 'memory'` runs Postgres inside this process and never reaches the network. It is a real engine, not a stand-in: a unique constraint throws on a duplicate, and the Postgres syntax the addon leans on behaves as it does on a server.

`onConnect` runs behind the schema sync queued at the moment the connection is registered, so it sees the tables of every addon loaded before that line and none of the ones loaded after it. Registering the connection after the application — the import above the `database.Item` call — is what puts the tables in front of the seed. Where an addon arrives later, its table is missing and the seed reports `Connection primary broke its onConnect` rather than failing silently.

The database is shared across the tests in a run, so a test names its own rows rather than counting on an empty table. Without the database addon `database` is `null` and everything else works as before.

## A front test

```js
tests.front.Item({
    id: 'directives.if.hides',
    addon: 'directives',
    description: 'ot-if leaves the node out when its expression is false.',
    callback: async function({ mount, assert })
    {
        await mount('<p id="a" ot-if="show">here</p>', { show: false });

        assert.missing('#a');
    }
});
```

Every front test opens its own page: a DOM, the whole front bundle assembled from `onetype.assets`, and an empty `#app` to mount into. Nothing carries over between tests. A test may name where the page believes it is with `url`, which defaults to `http://localhost/`.

### What the page offers

| Doing | |
| --- | --- |
| `mount(markup, data)` | Renders markup into `#app` with the data behind it. |
| `click(selector)` | Clicks the node. Throws where nothing matches. |
| `type(selector, value)` | Types into the node and fires input and change. |
| `visit(path)` | Moves to a path and fires popstate. |
| `back()` | Goes back through history. |
| `run(callback, ...args)` | Runs the callback inside the page. |
| `network(routes)` | Answers fetch from a map of url to body, with no server. |
| `settle()` | Drains the queued animation frames by hand. |

| Asking | |
| --- | --- |
| `assert.text(selector, expected)` | The node reads exactly this. |
| `assert.contains(selector, needle)` | The node holds this somewhere. |
| `assert.exists(selector)` | Something matches. |
| `assert.missing(selector)` | Nothing matches. |
| `assert.count(selector, expected)` | This many match. |
| `assert.attribute(selector, name, expected)` | The attribute reads this. |
| `assert.path(expected)` | The page sits at this path. |
| `dom()` and `eval(source)` | The raw way out, for whatever the helpers do not cover. |

Every action settles on its own, so a click is followed by the render it caused before the next line reads the DOM.

### The callback crosses a boundary

`run` hands its callback to the page as source, so it arrives without anything it closed over. This works:

```js
await run((label) => { document.querySelector('#app').textContent = label; }, 'Hello');
```

This does not, because `label` never makes the trip:

```js
const label = 'Hello';

await run(() => { document.querySelector('#app').textContent = label; });
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
- Each front test gets a fresh page, so no front test can be broken or saved by the one before it.
- Tests never starts a database of its own, so a run reaches exactly what the application handed it and nothing else.
