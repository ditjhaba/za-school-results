Frontend.CountryController = Ember.ObjectController.extend({
  needs: ["counter"],
  counter: Ember.computed.alias("controllers.counter"),

  showCountry: function() {
    var that = this;
    this.store.find('country', 1).then(function(country) {
      var display_data_type = window.data_type;
      var counter = that.get('counter');
      counter.set('model', that.store.createRecord('counter'));

      if (display_data_type === "display_matric_results"){
        counter.set('passed', country.get('passed'));
        counter.set('wrote', country.get('wrote'));
        counter.set('pass_rate', country.get('pass_rate'));
        counter.set('matric_year', "Matric Results 2013");
      }
      else {
        counter.set('no_of_boys', country.get('no_of_boys'));
        counter.set('no_of_girls', country.get('no_of_girls'));
        counter.set('total_toilets', country.get('total_toilets'));
        counter.set('sanitation_year', "Sanitation Information");
      }
      counter.set('country', country.get('name'));
      counter.send('startOdometer');
    });
  }.property('showCountry'),
});