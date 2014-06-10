Frontend.Province = DS.Model.extend({

  name: DS.attr(),
  code: DS.attr(),
  passed: DS.attr(),
  wrote: DS.attr(),
  no_of_boys: DS.attr(),
  no_of_girls: DS.attr(),
  total_toilets: DS.attr(),
  sanitation_plan: DS.attr(),
  construction: DS.attr(),
  running_water: DS.attr(),
  matric_year: DS.attr(),
  sanitation_year: DS.attr(),
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
    var display_data = window.data_type;

    if(display_data === "display_matric_results") {
      counter.set('title', this.get('name'));
      counter.set('passed', this.get('passed'));
      counter.set('wrote', this.get('wrote'));
      counter.set('pass_rate', this.get('pass_rate'));
    }
    else {
      counter.set('no_of_boys', this.get('no_of_boys'));
      counter.set('no_of_girls', this.get('no_of_girls'));
      counter.set('total_toilets', this.get('total_toilets'));
      counter.set('sanitation_plan', this.get('sanitation_plan'));
      counter.set('construction', this.get('construction'));
      counter.set('running_water', this.get('running_water'));
      counter.set('matric_year', "");
      counter.set('sanitation_year', "Sanitation 2013");
    }
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
