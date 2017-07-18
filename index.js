const path = require('path');
const fs = require('fs');
const rollup = require('rollup').rollup;

const vueBoxEvent = (eName, eData) => {
	return {
		name: eName,
		data: eData
	};
};

const vueBox = (options) => {
	const defaults = {
		props: {},
		vuePath: '/',
		componentPath: '/',
		testName: 'default',
		outputDir: 'tests',
		externals: [],
		globals: {}
	};
	const opts = Object.assign({}, defaults, options);

	const cleanFile = (fileString) => {
		const templateRegex = /<template>(.|\n)*?<\/template>/g;
		const scriptTagsRegex = /<script>|<\/script>/g;

		return fileString.replace(templateRegex, '').replace(scriptTagsRegex, '');
	};

	const writeBundle = (bundle, currPath) => {
		return new Promise((resolve, reject) => {
			if (bundle && currPath) {
				return resolve(bundle.write({
					dest: currPath,
					format: 'cjs',
					exports: 'named',
					moduleName: opts.testName.replace(/\W\s/g, ''),
					globals: opts.globals
				}));
			}

			return reject(new Error('No Bundle or Path provided'));
		});
	};

	const replaceImport = (script, name) => {
		const varReg = /(?!import)\s([A-Z][0-9]?)+\s(?=from)/i;
		const importReg = /import\s([A-Z][0-9]?)+\sfrom\s(.)+\.vue'?;?/i;
		const varName = script.match(varReg)[0];

		return script.replace(importReg, `var ${varName.replace(/\W\s?/g, '')} = ${name.replace(/\W\s?/g, '')}`);
	};

	const importComp = (script) => {
		const reg = /(\w\d?[-_\s]?)+\/(\w\d?[-_\s]?)+\.vue/ig;
		const compList = script.match(reg, '');
		let fullScript = '';
		let origScript = script;

		compList.forEach(comp => {
			const [name, fileName] = comp.split('/');
			const pathOpt = path.resolve(opts.componentPath, name, fileName);
			const compString = cleanFile(fs.readFileSync(pathOpt, 'utf-8'));
			const cleanCompString = compString.replace('default', `var ${name.replace(/\W\s?/g, '')} = `);

			if (compString.includes('.vue')) {
				return importComp(cleanCompString);
			}

			origScript = replaceImport(origScript, name);
			fullScript += cleanCompString;

			return fullScript;
		});

		fullScript += origScript;

		return fullScript;
	};

	const applyScopedData = (scope, {props, data}) => {
		let propData = '';
		let val = '';

		for (propData in props) {
			scope[propData] = props[propData];
		}
		for (val in data) {
			scope[val] = data[val];
		}

		return scope;
	};

	const setupMethods = (vm) => {
		vm.methods = applyScopedData(vm.methods, vm);
		vm.methods.$emit = vueBoxEvent;
		vm.methods.event = {};

		return vm.methods;
	};

	const executeData = vm => {
		vm.data = vm.data();
		vm.props = opts.props;
		vm.computed = applyScopedData(vm.computed, vm);
		vm.methods = setupMethods(vm);
		let prop = '';

		for (prop in vm.computed) {
			if (typeof vm.computed[prop] === 'function') {
				vm.methods[prop] = vm.computed[prop]();
			}
		}

		return vm;
	};

	const main = () => {
		return new Promise((resolve, reject) => {
			const pathOpt = path.resolve(opts.vuePath);
			const scriptString = cleanFile(fs.readFileSync(pathOpt, 'utf-8'));
			const currPath = path.join(pathOpt.replace(/\/(\w\d?[-_\s]?)+\.vue/ig, ''), opts.outputDir, `${opts.testName}.js`);
			let bundleScript = '';

			if (!scriptString) {
				reject(new Error('No Vue file given'));
			}
			if (scriptString.includes('.vue')) {
				bundleScript = importComp(scriptString);
			} else {
				bundleScript = scriptString;
			}

			fs.writeFileSync(currPath, bundleScript);
			rollup({
				entry: currPath,
				external: opts.externals
			}).then(bundle => {
				writeBundle(bundle, currPath).then(() => {
					let vue = require(currPath);

					if (vue.default) {
						let prop = '';

						for (prop in vue.default.components) {
							vue.default.components[prop] = executeData(vue.default.components[prop]);
						}
						vue = executeData(vue.default);
					} else {
						vue = executeData(vue);
					}

					return resolve(vue);
				});

			});
		});
	};

	return main();
};

module.exports = vueBox;
