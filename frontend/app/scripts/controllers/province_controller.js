Frontend.ProvinceController = Ember.ObjectController.extend({
  needs: ['counter', 'legend'],
  counter: Ember.computed.alias("controllers.counter"),
  legend: Ember.computed.alias("controllers.legend"),

  drawAll: function() {
    var that = this;
    Ember.$.ajax('/data/sa_provinces.json').then( function(data){
      Frontend.globalPaths = data;
      that.get('store').findAll('province').then(function(provinces) {
        var ranges = that.calculatePassRateRanges(provinces);
        that.setLegendPassRateRanges(ranges);
        provinces.forEach(function(province) {
          province.set('pass_rate_ranges', ranges);
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

  calculatePassRateRanges: function(provinces) {
    var passRates = [];
    provinces.forEach(function(thisProvince) {
      passRates.push(thisProvince.get('pass_rate'));
    });
    
    var upperBound = Math.max.apply(null,passRates);
    var lowerBound = Math.min.apply(null,passRates);
    var QR = (upperBound - lowerBound)/5;
    var ranges = [];
    for(var i = 0; i <= 5; i++) {
      ranges.push(lowerBound + i*QR);
    }

    return ranges;
  },

  setLegendPassRateRanges: function(ranges) {
    var legend = this.get('legend');
    legend.set('model', this.store.createRecord('legend'));
    legend.set('floor', ranges[0]);
    legend.set('first_quintile', ranges[1]);
    legend.set('second_quintile', ranges[2]);
    legend.set('third_quintile', ranges[3]);
    legend.set('fourth_quintile', ranges[4]);
    legend.set('ceiling', ranges[5]);
    legend.send('makeLegend');
  }
});







