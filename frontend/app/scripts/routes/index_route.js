Frontend.IndexRoute = Ember.Route.extend({
  setupController: function() {
  	return this.get("store").all("school")
  },

  enter: function() {
  	window.data_type = "display_matric_results"
  }
});
