Frontend.ProvinceController = Ember.ObjectController.extend({
  needs: ['counter', 'legend'],
  counter: Ember.computed.alias("controllers.counter"),
  legend: Ember.computed.alias("controllers.legend"),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
        provinces.forEach(function(province) {
          that.setPassRateBounds(province, provinces);
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

  setPassRateBounds: function(province, provinces) {
    var passRates = [];
    provinces.forEach(function(thisProvince) {
      passRates.push(thisProvince.get('pass_rate'));
    });
    var upperBound = Math.max.apply(null,passRates);
    var lowerBound = Math.min.apply(null,passRates); 
    province.set('minPassRate', lowerBound);
    province.set('maxPassRate', upperBound);
    this.calculateAndSetLegendQuintiles(lowerBound, upperBound);
  },

  calculateAndSetLegendQuintiles: function(lowerBound, upperBound) {
    var QR = (upperBound - lowerBound)/5;

    var legend = this.get('legend');
    legend.set('model', this.store.createRecord('legend'));
    legend.set('floor', lowerBound);
    legend.set('first_quintile', lowerBound + QR);
    legend.set('second_quintile', lowerBound + 2*QR);
    legend.set('third_quintile', lowerBound + 3*QR);
    legend.set('fourth_quintile', lowerBound + 4*QR);
    legend.set('ceiling', upperBound);
    legend.send('makeLegend');
  }
});







