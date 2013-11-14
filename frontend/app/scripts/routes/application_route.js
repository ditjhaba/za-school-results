Frontend.IndexRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    var country = store.find('country', 1);
    Ember.run.later(function(){
        country.set('country_name', country.get('name'));
        country.set('country_passed', country.get('passed'));
        country.set('country_wrote', country.get('wrote'));
    }, 1900);

    return country;
  }
});
