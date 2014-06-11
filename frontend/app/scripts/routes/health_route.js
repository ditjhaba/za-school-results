Frontend.HealthRoute = Ember.Route.extend({
  model: function() {
	  return this.get("store").all("sanitation")
	},

	enter: function() {
		window.data_type = "display_sanitation"
	}
});
