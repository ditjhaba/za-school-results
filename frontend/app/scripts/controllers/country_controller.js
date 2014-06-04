Frontend.CountryController = Ember.ObjectController.extend({
  needs: ["counter"],
  counter: Ember.computed.alias("controllers.counter"),

  showCountry: function() {
    var that = this;
    this.store.find('country').then(function(country) {
      var counter = that.get('counter');
      counter.set('model', that.store.createRecord('counter'));
      counter.set('passed', country.get('passed'));
      counter.set('wrote', country.get('wrote'));
      counter.set('pass_rate', country.get('pass_rate'));
      counter.set('title', country.get('name'));
      counter.send('startOdometer');
    });
  }.property('showCountry'),
});