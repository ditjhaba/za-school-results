Frontend.IndexController = Ember.ArrayController.extend({
  actions: {
    drawOverlay: function() {

      var model = this.get('model');
      model.forEach(function(province){
        var paths = province.get('polygonPaths');

        // draw province layer
        var polygon = Frontend.map.drawPolygon({
          paths: paths,
          useGeoJSON: true,
          strokeColor: '#BBD8E9',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#BBD8E9',
          fillOpacity: 0.8
        });

        // draw province names in middle of province layers
        var polyCenter = polygon.getBounds().getCenter();
        Frontend.map.drawOverlay({
           lat: polyCenter.lat(),
           lng: polyCenter.lng(),
           layer: 'overlayLayer',
           content: '<div class="province">' + province.get('name') + '</div>',
           verticalAlign: 'middle',
           horizontalAlign: 'center'
         });

        Ember.run(this, function() {

          window.google.maps.event.addListener(polygon, 'mouseout', function() {
            this.setOptions( {fillOpacity: 0.8});
          });
          window.google.maps.event.addListener(polygon, 'mouseover', function() {
            this.setOptions( {fillOpacity: 0.6 });
          });

          window.google.maps.event.addListener(polygon, 'click', function() {
             Frontend.map.setZoom(8);
             Frontend.map.setCenter(polyCenter.lat(), polyCenter.lng());
           });
        });
      });
    },
    startOdometer: function() {
      Ember.run(this, function() {
        var el = document.querySelector('.students-passed-percent');
        window.od = new window.Odometer({
          el: el,
          value: 0,
        });
        el.innerHTML = 200000;
      });
    }
  }
});