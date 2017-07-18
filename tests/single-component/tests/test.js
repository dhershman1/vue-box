const test = require('tape');
const vueBox = require('../../../index.js');

vueBox({
	vuePath: `${__dirname}/../index.vue`,
	outputDir: 'tests',
	testName: 'Single-Component',
	externals: ['underscore'],
	globals: {
		underscore: '_'
	}
}).then(vm => {
	test('Does our Method exist', t => {
		t.ok(vm.methods, 'Methods Came back OK');
		t.ok(typeof vm.methods.runCoolTest === 'function', 'Our method exists and is a function');
		t.equal(vm.methods.runCoolTest('cheese'), 'You sent: cheese', 'Our method ran and returned successfully');
		t.end();
	});

	test('Does our This exist', t => {
		t.ok(vm, 'This returns OK');
		t.equal(vm.data.aTest, 'CoolData', 'This scope has our test value in it');
		t.end();
	});

	test('Make sure underscore was set', t => {
		t.ok(vm.methods.runUnderscoreTest(), 'Underscore ran and responded correctly');
		t.end();
	});
});
