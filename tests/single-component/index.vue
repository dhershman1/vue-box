<template>
	<div>
		<p>Test Elements</p>
	</div>
</template>

<script>
	import _ from 'underscore';

	export default {
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
</script>
