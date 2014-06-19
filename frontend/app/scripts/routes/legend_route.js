Frontend.LegendRoute = Ember.Route.extend({
	model: function() {
		var legendModel = this.get('store').createRecord('legend');
		return legendModel;
	}
});