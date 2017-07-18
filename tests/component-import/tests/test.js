const test = require('tape');
const vueBox = require('../../../index.js');

vueBox({
	vuePath: `${__dirname}/../index.vue`,
	outputDir: 'tests',
	testName: 'Import-Component',
	componentPath: `${__dirname}/../../`,
	externals: ['underscore'],
	globals: {
		underscore: '_'
	}
}).then(vm => {
	test('Does our Method exist', t => {
		t.ok(vm.methods, 'Methods Came back OK');
		t.ok(typeof vm.methods.importTesting === 'function', 'Our method exists and is a function');
		t.equal(vm.methods.importTesting(), 'Testing imports', 'Our method ran and returned successfully');
		t.end();
	});

	test('Does our This exist', t => {
		t.ok(vm.data, 'This returns OK');
		t.equal(vm.data.aTest, 'CoolData', 'This scope has our test value in it');
		t.end();
	});

	test('We should have a component imported', t => {
		t.ok(vm.components, 'Components object present');
		t.ok(vm.components.testComponent, 'TestComponent present');
		t.equal(vm.components.testComponent.methods.runCoolTest('Done'), 'You sent: Done', 'Able to call component method');
		t.end();
	});
});
