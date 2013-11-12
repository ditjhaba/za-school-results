Frontend.Province = DS.Model.extend({
  name: DS.attr(),
  code: DS.attr(),
  index: DS.attr(),

  polygonPaths: function() {
    if(Frontend.globalPaths === undefined) {
      Ember.$.ajax('http://localhost:9000/data/sa_provinces.json', {async: false}).success(function(data) {
        Frontend.globalPaths = data;
      });
    }
    return Frontend.globalPaths.features[this.get('index')].geometry.coordinates;
  }.property("polygonPaths")
});



// drawOverlay: function() {

//   // Frontend.map.drawPolygon({
//   //   paths: this.polygonPaths(),
//   //   useGeoJSON: true,
//   //   strokeColor: '#BBD8E9',
//   //   strokeOpacity: 1,
//   //   strokeWeight: 3,
//   //   fillColor: '#BBD8E9',
//   //   fillOpacity: 0.6
//   // });
// },