// This file is part of OneType. Created and led by Dejan Tomic <hi@iamdejan.com>, co-authored by Stefan Pakic, onetype.ai

const tests = onetype.Addon('tests', (addon) =>
{
    addon.Description('Runs the tests a package registers and answers one report per test, whichever side it proves.');
});

export default tests;
