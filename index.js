const path = require('path');
const fs = require('fs');
const rollup = require('rollup').rollup;

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
				moduleName: opts.testName.replace(/\W\s/g, ''),
				globals: opts.globals
			}));
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

	const vueBox = () => {
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
					return resolve(require(currPath));
				});

			});
		});
	};

	return vueBox();
};
