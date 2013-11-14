Frontend.Province = DS.Model.extend({
  name: DS.attr(),
  code: DS.attr(),
  passed: DS.attr(),
  wrote: DS.attr(),

  index: function() {
    return this.get('id') - 1;
  }.property('index'),

  dataFromJSON: function() {
    var that = this;
    if(Frontend.globalPaths === undefined) {
      Ember.$.ajax('/data/sa_provinces.json', {async: false}).success(function(data) {
        Frontend.globalPaths = data;
      });
    }

    var provinceData = Frontend.globalPaths.features.find(function(item, idx) {
        if(item.properties.CAPTION === that.get('name')) {
            return true;
        } else {
            return false;
        }
    });
    return provinceData;
  }.property('dataFromJSON'),

  polygonPaths: function() {
    return this.get('dataFromJSON').geometry.coordinates;
  }.property("polygonPaths")


});