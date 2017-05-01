const join = require('path').join;
const test = require('tape');
const vueBox = require('../../../index.js');
const compTest = vueBox(join(__dirname, '..'), {
	blacklistNames: ['components']
});
const instance = compTest();
const vueMethods = instance.getVueExport().methods;
instance.setThis(instance.getVueExport().data());
const vueThis = instance.getThis();

test('Does our Method exist', t => {
	t.ok(vueMethods, 'Methods Came back OK');
	t.ok(typeof vueMethods.runCoolTest === 'function', 'Our method exists and is a function');
	t.equal(vueMethods.runCoolTest('cheese'), 'You sent: cheese', 'Our method ran and returned successfully');
	t.end();
});

test('Does our This exist', t => {
	t.ok(vueThis, 'This returns OK');
	t.equal(vueThis.aTest, 'CoolData', 'This scope has our test value in it');
	t.end();
});

test('Make sure underscore was set', t => {
	t.ok(vueMethods.runUnderscoreTest(), 'Underscore ran and responded correctly');
	t.end();
});
