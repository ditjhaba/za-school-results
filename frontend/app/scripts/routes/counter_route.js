Frontend.CounterRoute = Ember.Route.extend({
  model: function() {
    var counterModel = this.get('store').createRecord('counter');
    return counterModel;
  }
});
