Frontend.AdminRoute = Ember.Route.extend({
	model: function() {
		return this.store.findAll('school');
	}
});