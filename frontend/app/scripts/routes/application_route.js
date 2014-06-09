Frontend.ApplicationRoute = Em.Route.extend({
	setupController: function(controller, model){
		this._super(controller, model);
		this.get("store").findAll("school");
	}
});