Frontend.Province = DS.Model.extend({
  name: DS.attr(),
  code: DS.attr(),
  index: DS.attr(),

  polygonPaths: function() {
    if(Frontend.globalPaths === undefined) {
      Ember.$.ajax('/data/sa_provinces.json', {async: false}).success(function(data) {
        Frontend.globalPaths = data;
      });
    }
    return Frontend.globalPaths.features[this.get('index')].geometry.coordinates;
  }.property("polygonPaths")
});