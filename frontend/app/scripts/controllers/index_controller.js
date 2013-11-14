Frontend.IndexController = Ember.ObjectController.extend({
  actions: {
    drawOverlay: function() {
      var store = this.get('store');
      var provinces = store.findAll('province');
      var that = this;

      Ember.run.later(function(){
        provinces.forEach(function(province){
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

           // google maps event listeners
           window.google.maps.event.addListener(polygon, 'mouseout', function() {
              this.setOptions( {fillOpacity: 0.8});
              that.set('name', that.get('country_name'));
              that.set('passed', that.get('country_passed'));
              that.set('wrote', that.get('country_wrote'));

            });
            window.google.maps.event.addListener(polygon, 'mouseover', function() {
              this.setOptions( {fillOpacity: 0.6 });
              that.set('name', province.get('name'));
              that.set('passed', province.get('passed'));
              that.set('wrote', province.get('wrote'));
            });

            window.google.maps.event.addListener(polygon, 'click', function() {
               Frontend.map.setZoom(7);
               Frontend.map.setCenter(polyCenter.lat(), polyCenter.lng());
             });
           });
       }, 2000);
    },

    startOdometer: function() {
      // var el = document.querySelector('.students-passed-percent');
      // this.odometerFor(el, this.get('pass_rate'));
      // el = document.querySelector('.students-passed');
      // this.odometerFor(el, this.get('passed'));
      // el = document.querySelector('.students-write');
      // this.odometerFor(el, this.get('wrote'));
    }

  },
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