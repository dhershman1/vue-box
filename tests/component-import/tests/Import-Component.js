'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('underscore'));

var singlecomponent =  {
		data() {
			return {
				aTest: 'CoolData',
				bTest: ''
			};
		},
		computed: {
			testComputed() {
				return this.aTest;
			},
			changeComputed() {
				this.aTest = 'Chicken';

				return this.aTest;
			},
			testIf() {
				if (this.aTest) {
					return 'All good';
				}

				return 'Not Good';
			},
			testIfElse() {
				if (this.aTest) {
					this.bTest = 'Panda';
				} else {
					this.bTest = 'Polar Bear';
				}

				return this.bTest;
			}
		},
		methods: {
			runCoolTest: function(param) {
				return `You sent: ${param}`;
			},
			runUnderscoreTest: function() {
				return _.isArray(['Test', 'Array']);
			}
		}
	};




	var testComponent = singlecomponent;

	var ImportComponent = {
		data() {
			return {
				aTest: 'CoolData'
			};
		},
		computed: {
			testComputed() {
				return this.aTest;
			},
			changeComputed() {
				this.aTest = 'Chicken';
				return this.aTest;
			},
			testedImport() {
				return testComponent.data();
			}
		},
		methods: {
			importTesting: function(param) {
				return 'Testing imports';
			}
		}
	};

exports.singlecomponent = singlecomponent;
exports['default'] = ImportComponent;
