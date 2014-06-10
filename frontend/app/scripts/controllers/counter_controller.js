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
  }.observes('passed', 'wrote', 'pass_rate','title'),

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