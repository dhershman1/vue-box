[![Build Status](https://travis-ci.org/dhershman1/vue-box.svg?branch=master)](https://travis-ci.org/dhershman1/vue-box)

# Vue Box
Grabs your vue file, turns it into standing JS and gives you back the object to run your tests against

**Please report any issues as soon as you can, I am one man and cannot test every need, or situation thank you! Please Feel free to leave suggestions on improvements/methods you'd want to see added. OR feel free to send a PR!**

### Changelog
You can find the changelog here:
https://github.com/dhershman1/vue-box/blob/master/changelog.md

### Params

- `options`: `Object` - An object of options to help Vue Box

### Options
```js
const defaults = {
	vuePath: '/', // The path to the vue file your currently testing
	componentPath: '/', // the path to where your components live
	testName: 'default', // Name of the current test (optional)
	outputDir: 'tests', // Specify where you want the ouput dir to be
	external: [], // Array of external modules E.G underscore
	globals: {} // An object of globals E.G { underscore: '_' }
};
```

### How To
Pass in a set of options to vueBox and go from there

For single vue files (not importing other vue components)

```js
const vueBox = require('vue-box');
vueBox({
	vuePath: `${__dirname}/../index.vue`,
	outputDir: 'tests',
	testName: 'Single-Component',
	externals: ['underscore'],
	globals: {
		underscore: '_'
	}
}).then(vm => {
	// You can now access your vue object here
});
```

For a vue file that is importing other vue components

```js
const vueBox = require('vue-box');
vueBox({
	vuePath: `${__dirname}/../index.vue`,
	outputDir: 'tests',
	testName: 'Import-Component',
	componentPath: `${__dirname}/../../`, // Note a path that points to the general components directory
	externals: ['underscore'], // General rollup settings
	globals: { // More general rollup settings
		underscore: '_'
	}
}).then(vm => {
	// You can now access your vue object here
	// Your main vue file will be under default so:
	vm.default.data() // etc...
	// You can also look at other components if you need too through the vm variabel
});
```
