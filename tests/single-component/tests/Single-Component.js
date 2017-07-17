'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('underscore'));

var SingleComponent = {
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

module.exports = SingleComponent;
