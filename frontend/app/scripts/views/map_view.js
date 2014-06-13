Frontend.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  didInsertElement: function() {
   Frontend.map = window.L.map('map', {zoomControl: false}).setView([-29.328516, 23.751131], 6);

    window.L.control.zoom({position: 'topright'}).addTo(Frontend.map);
   // window.L.control.pan().addTo(Frontend.map);
   // // new window.L.Control.Zoom({ position: 'topright' }).addTo(Frontend.map);
    window.L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        key: 'BC9A493B41014CAABB98F0471D759707',
        styleId: 22677
      }).addTo(Frontend.map);

    window.L.control.pan({position: 'topright'}).addTo(Frontend.map);
  }
});
