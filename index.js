const path = require('path');
const fs = require('fs');
const rollup = require('rollup').rollup;
const multiEntry = require('rollup-plugin-multi-entry');

module.exports = (options) => {
	const defaults = {
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
		return new Promise((resolve) => {
			resolve(bundle.write({
				dest: currPath,
				format: 'cjs',
				globals: opts.globals
			}));
		});
	};

	const importComp = (script) => {
		const reg = /(\w\d?[-_\s]?)+\/(\w\d?[-_\s]?)+\.vue/ig;
		const compList = script.replace(reg, '').split(/\n\r|\n/g);
		let componentPaths = [];

		componentPaths = compList.map(comp => {
			const [name, fileName] = comp;
			const pathOpt = path.resolve(opts.componentPath, name, fileName);
			const scriptString = cleanFile(fs.readFileSync(pathOpt, 'utf-8'));

			if (scriptString.includes('.vue')) {
				return importComp(scriptString);
			}

			return pathOpt;
		});

		return componentPaths;
	};

	const vueBox = () => {
		return new Promise((resolve, reject) => {
			const pathOpt = path.resolve(opts.vuePath);
			const scriptString = cleanFile(fs.readFileSync(pathOpt, 'utf-8'));
			const currPath = path.join(pathOpt.replace(/\/(\w\d?[-_\s]?)+\.vue/ig, ''), opts.outputDir, `${opts.testName}.js`);
			let componentPaths = '';

			if (!scriptString) {
				reject(new Error('No Vue file given'));
			}
			if (scriptString.includes('.vue')) {
				componentPaths += importComp(scriptString);
			}


			fs.writeFileSync(currPath, scriptString, 'utf-8');
			rollup({
				entry: {
					include: currPath
				},
				external: opts.externals
			}).then(bundle => {
				writeBundle(bundle, currPath).then(() => {
					return resolve(require(currPath));
				});

			});
		});
	};

	return vueBox();
};
