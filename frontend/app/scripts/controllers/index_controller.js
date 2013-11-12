Frontend.IndexController = Ember.ArrayController.extend({
  actions: {
    drawOverlay: function() {
      console.log('drawing');
      var model = this.get('model');
      model.forEach(function(province){
        var paths = province.get('polygonPaths');

        Frontend.map.drawPolygon({
          paths: paths,
          useGeoJSON: true,
          strokeColor: '#BBD8E9',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#BBD8E9',
          fillOpacity: 0.6
        });

        // var bounds= new google.maps.LatLngBounds();
        // paths.forEach(function(path) {
        //     bounds.extend(path);
        // });
        // for (int i = 0; i < paths.length; i++) {
        //   bounds.extend(paths[i]);
        // }

        // var polyCenter = bounds.getCenter();
      });

      Frontend.map.drawOverlay({
         lat: Frontend.map.getCenter().lat(),
         lng: Frontend.map.getCenter().lng(),
         layer: 'overlayLayer',
         content: '<div class="south-africa">Pass Rate: 98%<div class="overlay_arrow above"></div></div>',
         verticalAlign: 'top',
         horizontalAlign: 'center'
       });



        // var marker = new google.maps.Marker({
        //     position: polyCenter ,
        //     map: map,
        //     title:"Center of bounds"
        // });



    }
    // .property("drawOverlay")
  }

});