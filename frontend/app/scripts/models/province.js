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
  minPassRate: DS.attr(),
  maxPassRate: DS.attr(),

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
    var q = (this.get('maxPassRate') - this.get('minPassRate'))/5;
    var base = this.get('minPassRate');

    return d > (base + 4*q)  ?  '#47A103' :
           d > (base + 3*q)  ?  '#E8DA04' :
           d > (base + 2*q)  ?  '#FFB707' :
           d > (base + q)    ?  '#E86605' :
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
    counter.set('title', this.get('name'));

    if(display_data === "display_matric_results") {
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
    }
  },

  zoomIn: function() {
    var provinceCenter = this.get('geo_json').getBounds().getCenter();
    Frontend.map.setView(provinceCenter, 8);
    this.showSchools();
  },

  popupForMatricResult: function(school) {
    var popupContent = "<h3>" + school.name + "</h3>";
        popupContent += "<ul class='popup-content'>"
        popupContent += "<li><strong>Pass Rate: </strong>" + school.pass_rate + "</li>";
        popupContent += "<li><strong>Students passed: </strong>" + school.passed + "</li>";
        popupContent += "<li><strong>Students wrote: </strong>" + school.wrote + "</li>";
        popupContent += "</ul>";

    return popupContent;
  },

  popupForSanitationInformation: function(school) {
    var popupContent = "<h3>" + school.name + "</h3>";
        popupContent += "<ul class='popup-content'>"
        popupContent += "<li><strong>Number of boys: </strong>" + school.no_of_boys + "</li>";
        popupContent += "<li><strong>Number of girls: </strong>" + school.no_of_girls + "</li>";
        popupContent += "<li><strong>Total toilets: </strong>" + school.total_toilets + "</li>";
        popupContent += "<li><strong>DOE Sanitation plan: </strong>" + school.sanitation_plan + "</li>";
        popupContent += "<li><strong>Running water: </strong>" + school.running_water + "</li>";
        popupContent += "<li><strong>Construction Status: </strong>" + school.construction + "</li>";
        popupContent += "</ul>";

    return popupContent;
  },

  showSchools: function() {
    var that = this;
    var url = "/province/" + this.get('code') + "/schools";
    Ember.$.getJSON(url).then(function(data){
      Ember.$.each(data, function(key, school) {
        var circle = window.L.circleMarker([school.lat, school.lng], {
            color: that.schoolFillColor(school.pass_rate), //make this generic
            opacity: 0.1,
            weight: 3,
            fillOpacity: 0.5,
          });

          if(window.data_type === "display_matric_results") {
            var popupContent = that.popupForMatricResult(school);
            circle.bindPopup(popupContent);
          }
          else {
            var popupContent = that.popupForSanitationInformation(school);
            circle.bindPopup(popupContent);
          }
          
          circle.addTo(Frontend.map);
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
