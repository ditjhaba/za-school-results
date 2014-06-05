Frontend.IndexRoute = Ember.Route.extend({
  model: function() {
		return this.store.findAll('sanitation');
	}
});
