Frontend.ProvinceController = Ember.ObjectController.extend({
  needs: "counter",
  counter: Ember.computed.alias("controllers.counter"),

  matric_result: function() {
    window.data_type = "display_matric_results";
  }.property('matric_result'),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
        provinces.forEach(function(province) {
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







