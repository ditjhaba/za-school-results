Frontend.HealthRoute = Ember.Route.extend({
  model: function() {
	  return this.get("store").all("sanitation")
	}
});
