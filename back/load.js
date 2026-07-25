// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

import tests from '#tests/back/addon.js';

import '#tests/back/functions/get.assert.js';
import '#tests/back/functions/get.picked.js';
import '#tests/back/functions/get.report.js';
import '#tests/back/functions/get.lines.js';
import '#tests/back/functions/get.wanted.js';
import '#tests/back/functions/get.written.js';

import '#tests/back/addons/back/load.js';
import '#tests/back/addons/front/load.js';

import '#tests/back/functions/exposed/run.js';
import '#tests/back/items/canon/patterns/tests.back.js';
import '#tests/back/items/canon/patterns/tests.front.js';
import '#tests/back/items/canon/reach/tests.js';

import '#tests/back/items/tests/back/asserts.js';
import '#tests/back/items/tests/back/counts.js';
import '#tests/back/items/tests/back/reports.js';
import '#tests/back/items/tests/back/runs.js';
import '#tests/back/items/tests/front/checks.js';
import '#tests/back/items/tests/front/isolated.js';
import '#tests/back/items/tests/front/network.js';
import '#tests/back/items/tests/front/tools.js';

export default tests;
