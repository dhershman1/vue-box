# Vue Box
Pulls in single Vue component files and allows you to isolate the JS of your vue to perform tests on your functionality, gives you the entire object (it will automatically exclude other components being set/used)

### Arguments
Vue Box takes two arguments:

- `vuePath`: `String` - A String pointing to the directory of your vue file
- `options`: `Object` - An object of options to help Vue Box

### Options
- `blacklistNames`: `Array` - An array of Strings to skip over if it is found within your imports
- `localModuleAlias`: `String` - A string that your local modules use
- `localPath`: `String` - A string that points to the directory of your local paths

```js
const vueBox = require('vue-box');
const myComponent = vueBox('path/to/directory', {
	blacklistNames: [], // Default
	localModuleAlias: '', // Default
	localPath: '' // Default
});
```

### How To
Simply pass in the string of the .vue file and the module will do the rest

The module will automatically grab dependencies your component needs based on its imports/requires, you can set blacklisted names in order to skip certain imports (such as other components)

```js
const vueBox = require('vue-box');
const myComponent = vueBox('path/to/directory', options);
// You can pass in an object to this function to set data to the fake this
const instance = myComponent({
	myData: 'Test'
});
```

### Methods

#### getThis()
Returns the vue this scope current to the instance, useful for checking or faking data needed in methods.
```js
const vueThis = instance.getThis();
```

#### getVueExport()
Returns the main export object that is set in the vue component
```js
const vueExport = instance.getVueExport();
```
