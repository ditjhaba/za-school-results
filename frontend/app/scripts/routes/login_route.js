Frontend.LoginRoute = Ember.Route.extend({

	model: function(){
        var loginModel = this.get('store').createRecord('login');
        return loginModel;
    },

    setupController: function(controller, model){
        controller.set('content', model);
    }
	
});