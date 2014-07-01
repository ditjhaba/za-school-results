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
  pass_rate_ranges: DS.attr(),

  geoJSONStyle: function() {
    return {
    fillColor: this.get('fillColor'),
      color: "#CCC",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.4
    }
  }.property("getGeoJSONStyle"),

  fillColourForMatricResults: function(pass_rate) {
      var d = pass_rate;
      var ranges = this.get('pass_rate_ranges');

      return d > ranges[4]  ?  '#47A103' :
             d > ranges[3]  ?  '#E8DA04' :
             d > ranges[2]  ?  '#FFB707' :
             d > ranges[1]  ?  '#E86605' :
                                  '#FF2B12' ;
  },

  fillColourForSanitationInformation: function(ratio) {
      return ratio > 40  ?  '#47A103' :
             ratio > 30  ?  '#E8DA04' :
             ratio > 20  ?  '#FFB707' :
             ratio > 10  ?  '#E86605' :
                            '#FF2B12' ;
  },

  fillColor: function() {
    if(window.data_type === "display_matric_results") {
      return this.fillColourForMatricResults(this.get('pass_rate'));
    } 
    else if(window.data_type === "display_sanitation") {
      var ratio = (this.get('no_of_boys') + this.get('no_of_girls'))/this.get('total_toilets');
      return this.fillColourForSanitationInformation(ratio);
    }
  }.property('fillColor'),

  schoolFillColor: function(school) {
    if(window.data_type === "display_matric_results") {
      return this.fillColourForMatricResults(school.pass_rate);
    } 
    else if(window.data_type === "display_sanitation") {
      console.log("Setting school colours for sanitation information");
      return school.no_of_boys != "unknown" ? 
             this.fillColourForSanitationInformation((school.no_of_boys + school.no_of_girls)/school.total_toilets) : 
             '#57A7C7';
    }
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
        console.log(school.no_of_boys);
        var circle = window.L.circleMarker([school.lat, school.lng], {
            color: that.schoolFillColor(school), //make this generic
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
