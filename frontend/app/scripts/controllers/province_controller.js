Frontend.ProvinceController = Ember.ObjectController.extend({
  needs: "counter",
  counter: Ember.computed.alias("controllers.counter"),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
      var minPassRate = that.findPassRateBound("MIN", provinces);
      var maxPassRate = that.findPassRateBound("MAX", provinces);
        provinces.forEach(function(province) {
          province.set('minPassRate', minPassRate);
          province.set('maxPassRate', maxPassRate);
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
  }.property('drawAll'),

  findPassRateBound: function(bound, provinces) {
    var passRates = [];
    provinces.forEach(function(province) {
      passRates.push(province.get('pass_rate'));
    });
    return bound == "MAX" ? Math.max.apply(null,passRates) : Math.min.apply(null,passRates);
  }
  
});







