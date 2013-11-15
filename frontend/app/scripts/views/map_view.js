Frontend.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  didInsertElement: function() {

   Frontend.map = window.L.map('map').setView([-30.559482,  22.937505999999985], 6);

    window.L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        key: 'BC9A493B41014CAABB98F0471D759707',
        styleId: 22677
      }).addTo(Frontend.map);

    this.get('controller').send('drawOverlay');
  }
});