Frontend.IndexController = Ember.ObjectController.extend({
  actions: {
    drawOverlay: function() {
      var store = this.get('store');
      var that = this;

      var provinceLookup = {};

      var geoJSONStyle = {
              fillColor: "#CCC",
              color: "#CCC",
              weight: 1,
              opacity: 1,
              fillOpacity: 0
            };

      Ember.$.ajax('/data/sa_provinces.json').then(function(data){
        Frontend.globalPaths = data;
        store.findAll('province').then(function(provinces) {
          provinces.forEach(function(province){
            
            var provinceGeoJSON = window.L.geoJson(province.get('dataFromJSON'), {style: geoJSONStyle});
            provinceGeoJSON.addTo(Frontend.map);
            provinceLookup[province.get('code')] = [provinceGeoJSON];            
          });

          var schools = store.findAll('school').then(function(schools){
            schools.forEach(function(school){
              var circle = window.L.circleMarker([school.get('lat'), school.get('lng')], {
                color: school.get('fillColor'),
                opacity: 0,
                fillColor: school.get('fillColor'),
                fillOpacity: 0.3,
              });
              circle.addTo(Frontend.map);
              popupContent = "<h3>" + school.get('name') + "</h3>";
              popupContent += "<ul class='popup-content'>"
              popupContent += "<li><strong>Pass Rate: </strong>" + school.get('pass_rate') + "%</li>";
              popupContent += "<li><strong>Students passed: </strong>" + school.get('passed') + "</li>";
              popupContent += "<li><strong>Students wrote: </strong>" + school.get('wrote') + "</li>";
              circle.bindPopup(popupContent);
              popupContent += "</ul>"

              circle.bringToFront();
              provinceLookup[school.get('province_code')].push(circle);
            });

            provinces.forEach(function(province){
              var group = window.L.featureGroup(provinceLookup[province.get('code')]).on('mouseover', function() {
                provinceLookup[province.get('code')][0].setStyle({
                    color: '#333',
                    weight: 2,
                    dashArray: ''
                 });

                if (!window.L.Browser.ie && !window.L.Browser.opera) {
                 provinceLookup[province.get('code')][0].bringToBack();
                }

                that.set('name', province.get('name'));
                that.set('passed', province.get('passed'));
                that.set('wrote', province.get('wrote'));
              }).on ('mouseout', function(){
                provinceLookup[province.get('code')][0].setStyle(geoJSONStyle);
                that.set('name', that.get('country_name'));
                that.set('passed', that.get('country_passed'));
                that.set('wrote', that.get('country_wrote'));
              });
              group.addTo(Frontend.map);
            });
          });
          startOdometer();
        });
      }); 
    },

    startOdometer: function() {
      var el = document.querySelector('.students-passed-percent');
      this.odometerFor(el, this.get('pass_rate'));
      el = document.querySelector('.students-passed');
      this.odometerFor(el, this.get('passed'));
      el = document.querySelector('.students-write');
      this.odometerFor(el, this.get('wrote'));
    }
  },

  odometerPassedValueChanged: function() {
    window.$('.students-passed').html(this.get('passed'));
    window.$('.students-write').html(this.get('wrote'));
    window.$('.students-passed-percent').html(this.get('pass_rate'));
  }.observes('passed', 'wrote', 'pass_rate'),

  odometerFor: function(element, value) {
    Ember.run(this, function() {
        new window.Odometer({
        el: element,
        value: 0
      });
      element.innerHTML = value;
    });
  }
});
