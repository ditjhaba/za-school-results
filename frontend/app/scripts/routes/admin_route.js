Frontend.AdminRoute = Ember.Route.extend({
	model: function() {
		return this.get("store").all("school")
	}
});