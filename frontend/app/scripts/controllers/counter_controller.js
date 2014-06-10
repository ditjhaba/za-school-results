Frontend.CounterController = Ember.ObjectController.extend({
  actions: {
    startOdometer: function() {
      console.log("starting odometer");
      // this.set('model', this.store.createRecord('counter'));
      var el = document.querySelector('.students-pass-rate');
      this.odometerFor(el, this.get('pass_rate'));
      el = document.querySelector('.students-passed');
      this.odometerFor(el, this.get('passed'));
      el = document.querySelector('.students-wrote');
      this.odometerFor(el, this.get('wrote'));
    }
  },

  odometerPassedValueChanged: function() {
    window.$('.students-passed').html(this.get('passed'));
    window.$('.students-wrote').html(this.get('wrote'));
    window.$('.students-pass-rate').html(this.get('pass_rate'));
    window.$('.title').html(this.get('title'));
    window.$('.number-of-boys').html(this.get('no_of_boys'));
    window.$('.number-of-girls').html(this.get('number_of_girls'));
    window.$('.total-toilets').html(this.get('total_toilets'));
    window.$('.sanitation-plan').html(this.get('sanitation_plan'));
    window.$('.construction').html(this.get('construction'));
    window.$('.running-water').html(this.get('running_water'));
  }.observes('passed', 'wrote', 'pass_rate','title', 'no_of_boys', 'number_of_girls',
    'total_toilets', 'sanitation_plan', 'construction', 'running_water'),


  odometerFor: function(element, value) {
    Ember.run(this, function() {
        new window.Odometer({
        el: element,
        value: 0
      });
      element.innerHTML = value;
    });
  }
});