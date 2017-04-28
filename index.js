const path = require('path');
const fs = require('fs');

module.exports = (vuePath, options) => {
	let script = '';
	let vueString = '';
	const defaults = {
		blacklistNames: [],
		localModuleAlias: '',
		localPath: ''
	};
	const opts = Object.assign({}, defaults, options);
	const dirs = fs.readdirSync(vuePath);

	dirs.forEach((item) => {
		if (path.extname(item) === '.vue') {
			vueString = fs.readFileSync(path.join(vuePath, item), 'utf-8');
			script = vueString.split(/\.?export\s?[a-z]+\s/g)[1].split('</script>')[0].slice(0, -2);
		}
	});

	function findLocalModule(loc) {
		const parsedLoc = path.parse(loc);
		const dirName = parsedLoc.dir.split(opts.localModuleAlias).pop();

		return path.join(process.cwd(), opts.localPath, dirName, parsedLoc.name);
	}

	function notBlackListed(str) {
		const len = opts.blacklistNames.length;
		let i = 0;
		let notListed = false;

		for (i; i < len; i++) {
			notListed = str.indexOf(opts.blacklistNames[i]) === -1;
		}

		return notListed;
	}

	// Break down require strings and insert them into our components
	function cleanRequires(moduleItem) {
		let moduleStr = moduleItem.split(/(var|const|let)/gi)[2];
		let moduleName = moduleStr.split('=')[0].trim();
		let moduleValue = moduleStr.match(/('|")(\w*|\w+\W\w+)('|")/gi)[0].replace(/('|")/g, '');

		if (notBlackListed(moduleName) && notBlackListed(moduleValue)) {
			if (opts.localModuleAlias && moduleValue.includes(opts.localModuleAlias)) {
				moduleValue = findLocalModule(moduleValue);
			}

			return {
				moduleName,
				moduleValue
			};
		}

		return null;
	}

	// Break down import strings and insert them to our components
	function cleanImport(moduleItem) {
		let moduleArr = moduleItem.split('import')[1].split('from');
		let moduleName = moduleArr[0].trim();
		let moduleValue = moduleArr[1].trim().replace(/('|")/g, '');

		if (notBlackListed(moduleName) && notBlackListed(moduleValue)) {
			if (opts.localModuleAlias && moduleValue.includes(opts.localModuleAlias)) {
				moduleValue = findLocalModule(moduleValue);
			}

			return {
				moduleName,
				moduleValue
			};
		}

		return null;
	}

	function cleaner(imp) {
		let cleanDep = '';

		if (imp.includes('import')) {
			cleanDep = cleanImport(imp);
		} else if (imp.includes('require')) {
			cleanDep = cleanRequires(imp);
		} else {
			cleanDep = null;
		}

		return cleanDep;
	}

	function removeExtraComponents(str) {
		return str.replace(/components:\s{([^<]+?)},?/gi, '');
	}

	// Sift through the imports to automatically grab dependencies
	function getImports() {
		const importRegex = /([A-Z])+\s\w+\s(from|=)\s(\w|'|")+[('"-\w\W)][^\s;]+/gi;
		let imports = vueString.match(importRegex);
		let i = 0;
		let len = imports.length;
		let depObj = {};
		let cleaned = {};

		for (i; i < len; i++) {
			cleaned = cleaner(imports[i]);

			if (cleaned) {
				depObj[cleaned.moduleName] = cleaned.moduleValue;
			}
		}

		return depObj;
	}

	// Goes through the script and replaces this with our fake this
	function fakeThis(str) {
		return str.replace(/\b(this\.)/g, 'self.');
	}

	// The function that will finally summon your dark lord of your methods object
	// Send in any props, or other data as a param that will get set to the functions this scope (fake this)
	function makeJS(str) {
		const fakedStr = fakeThis(str);
		const jsFunc = function(vueObj) {
			let deps = getImports();
			let mainStr = removeExtraComponents(fakedStr);
			let self = vueObj || {};
			let prop = '';

			for (prop in deps) {
				global[prop] = require(deps[prop]);
			}
			function getThis() {
				return self;
			}

			function getVueExport() {
				return eval(`(${mainStr})`);
			}

			return {
				getVueExport,
				getThis
			};
		};

		return jsFunc;
	}

	return makeJS(script);
};
