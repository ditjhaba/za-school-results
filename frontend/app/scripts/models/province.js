Frontend.Province = DS.Model.extend({
  name: DS.attr(),
  code: DS.attr(),

  polygonPaths: function(globalPaths, index) {
    return polygonPaths.features[index].geometry.coordinates;
  }
});