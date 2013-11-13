Frontend.Province = DS.Model.extend({
  name: DS.attr(),
  code: DS.attr(),
  pass: DS.attr(),
  wrote: DS.attr(),

  index: function() {
    return this.get('id') - 1;
  }.property('index'),

  polygonPaths: function() {
    if(Frontend.globalPaths === undefined) {
      Ember.$.ajax('/data/sa_provinces.json', {async: false}).success(function(data) {
        Frontend.globalPaths = data;
      });
    }
    return Frontend.globalPaths.features[this.get('index')].geometry.coordinates;
  }.property("polygonPaths")
});