Frontend.CreateRoute = Ember.Route.extend({
    model: function(){
        var schoolModel = this.get('store').createRecord('school');
        return schoolModel;
    },

    setupController: function(controller, model){
        controller.set('content', model);
    }
});