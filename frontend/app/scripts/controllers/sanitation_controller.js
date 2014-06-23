Frontend.SanitationController = Ember.ObjectController.extend({
  needs: ['counter','province'],
  counter: Ember.computed.alias("controllers.counter"),
  province_controller: Ember.computed.alias("controllers.province"),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
        var quintiles = that.get('province_controller').calculateQuintiles(provinces)
        provinces.forEach(function(province) {
          province.set('quintiles', quintiles);
          var provinceGeoJSON = window.L.geoJson( province.get('dataFromJSON'),
                                                  { style: province.get('geoJSONStyle'),
                                                    province: province,
                                                    onEachFeature: province.get('onEachFeature') });
          province.set('geo_json', provinceGeoJSON);
          provinceGeoJSON.addTo(Frontend.map);
          window.province = province;

        });
      });
    });
  }.property('drawAll')
  
});








  