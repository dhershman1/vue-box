<template>
	<div>
		<p>Test Elements</p>
	</div>
</template>

<script>
	import testComponent from '../single-component/index.vue';

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
			importTesting: function(param) {
				return 'Testing imports';
			}
		}
	}
</script>
