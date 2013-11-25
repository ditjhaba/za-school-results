Frontend.Province = DS.Model.extend({

  name: DS.attr(),
  code: DS.attr(),
  passed: DS.attr(),
  wrote: DS.attr(),
  geo_json: DS.attr(),

  geoJSONStyle: function() {
    return {
    fillColor: this.get('fillColor'),
      color: "#CCC",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.4
    }
  }.property("getGeoJSONStyle"),

  fillColor: function() {
    var d = this.get('pass_rate');

    return d > 80  ?  '#47A103' :
           d > 60   ? '#E8DA04' :
           d > 40   ? '#FFB707' :
           d > 20   ? '#E86605' :
                      '#FF2B12';
  }.property('fillColor'),

  schoolFillColor: function(pass_rate) {
    var d = pass_rate;

    return d > 80  ?  '#47A103' :
           d > 60   ? '#E8DA04' :
           d > 40   ? '#FFB707' :
           d > 20   ? '#E86605' :
                      '#FF2B12';
  },

  pass_rate: function() {
     return (this.get('passed')/this.get('wrote')) * 100;
  }.property('pass_rate', 'passed', 'wrote'),

  index: function() {
    return this.get('id') - 1;
  }.property('index'),

  dataFromJSON: function() {
    var that = this;

    var provinceData = Frontend.globalPaths.features.find(function(item, idx) {
        if(item.properties.CAPTION === that.get('name')) {
            return true;
        } else {
            return false;
        }
    });
    return provinceData;
  }.property('dataFromJSON'),

  setCounter: function() {
    var counter = window.Frontend.__container__.lookup("controller:counter");
    counter.set('title', this.get('name'));
    counter.set('passed', this.get('passed'));
    counter.set('wrote', this.get('wrote'));
    counter.set('pass_rate', this.get('pass_rate'));
  },

  resetCounter: function() {
    this.get('store').find('country', 1).then(function(country) {
      country.setCounter();
    });
  },

  zoomIn: function() {
    var provinceCenter = this.get('geo_json').getBounds().getCenter();
    Frontend.map.setView(provinceCenter, 8);
    this.showSchools();
  },

  showSchools: function() {
    var that = this;
    var url = "/province/" + this.get('code') + "/schools";
    Ember.$.getJSON(url).then(function(data){
      Ember.$.each(data, function(key, school) {
        var circle = window.L.circleMarker([school.lat, school.lng], {
            color: that.schoolFillColor(school.pass_rate),
            opacity: 0.1,
            weight: 3,
            fillOpacity: 0.5,
          });
          circle.addTo(Frontend.map);
          var popupContent = "<h3>" + school.name + "</h3>";
          popupContent += "<ul class='popup-content'>"
          popupContent += "<li><strong>Pass Rate: </strong>" + school.pass_rate + "%</li>";
          popupContent += "<li><strong>Students passed: </strong>" + school.passed + "</li>";
          popupContent += "<li><strong>Students wrote: </strong>" + school.wrote + "</li>";
          popupContent += "</ul>"
          circle.bindPopup(popupContent);
          circle.bringToFront();
      });
    });
  },

  onEachFeature: function(feature, layer)  {
    var province = this.province;
    layer.on("mouseover", function (e) {
      province.setCounter();
      layer.setStyle({
        color: '#333',
        weight: 1,
        dashArray: ''
      });
    });

    // layer.on("mouseout", function (e) {
    //   province.resetCounter();
    //   layer.setStyle(layer.options.style);
    // });

    layer.on('click', function() {
      layer.setStyle({
        opacity: 1,
        fillOpacity: 0
      });
      province.zoomIn();
    });
  }
});
