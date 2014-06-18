Frontend.ProvinceController = Ember.ObjectController.extend({
  needs: "counter",
  counter: Ember.computed.alias("controllers.counter"),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
      var passRateRange = that.findPassRateRange(provinces);
        provinces.forEach(function(province) {
          var provinceGeoJSON = window.L.geoJson( province.get('dataFromJSON'),
                                                  { style: province.get('geoJSONStyle'),
                                                    province: province,
                                                    onEachFeature: province.get('onEachFeature') });
          province.set('passRateRange', passRateRange);
          province.set('geo_json', provinceGeoJSON);
          provinceGeoJSON.addTo(Frontend.map);
          window.province = province;
        });
      });
    });
  }.property('drawAll'),

  findPassRateRange: function(provinces) {
    var passRates = [];
    provinces.forEach(function(province) {
      passRates.push(province.get('pass_rate'));
    });
    return (Math.max.apply(null,passRates)) - (Math.min.apply(null,passRates));
  }
  
});







