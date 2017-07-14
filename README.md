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
Simply pass in the string of the .vue file and the module will do the rest

The module will automatically grab dependencies your component needs based on its imports/requires, you can set blacklisted names in order to skip certain imports (such as other components)

```js
const vueBox = require('vue-box');
const myComponent = vueBox(options).then(vm => {
	// vm will be for Vue object that contains all of your data and functions
});
```
