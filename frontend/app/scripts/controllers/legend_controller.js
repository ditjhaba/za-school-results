Frontend.LegendController = Ember.ObjectController.extend({
	actions: {
		makeLegend: function() {
			console.log(this.get('floor'));
			console.log(this.get('first_quintile'));
			console.log(this.get('second_quintile'));
			console.log(this.get('third_quintile'));
			console.log(this.get('fourth_quintile'));
			console.log(this.get('ceiling'));
		}
	},
});