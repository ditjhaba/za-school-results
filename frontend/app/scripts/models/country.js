Frontend.Country = DS.Model.extend({
  name: DS.attr(),
  passed: DS.attr(),
  wrote: DS.attr(),
  no_of_boys: DS.attr(),
  no_of_girls: DS.attr(),
  total_toilets: DS.attr(),
  sanitation_plan: DS.attr(),
  construction: DS.attr(),
  running_water: DS.attr(),
  matric_year: DS.attr(),
  sanitation_year: DS.attr(),

  pass_rate: function() {
     return (this.get('passed')/this.get('wrote')) * 100;
  }.property('pass_rate', 'passed', 'wrote'),

  setCounter: function() {
    var counter = window.Frontend.__container__.lookup("controller:counter");
    counter.set('title', this.get('name'));
    counter.set('passed', this.get('passed'));
    counter.set('wrote', this.get('wrote'));
    counter.set('pass_rate', this.get('pass_rate'));
  },
});