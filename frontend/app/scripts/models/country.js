Frontend.Country = DS.Model.extend({
  passed: DS.attr(),
  wrote: DS.attr(),

  pass_rate: function() {
     return (this.get('passed')/this.get('wrote')) * 100;
  }.property('pass_rate')
});