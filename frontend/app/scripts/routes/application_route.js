Frontend.IndexRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    return store.find('country', 1);
  }
});
