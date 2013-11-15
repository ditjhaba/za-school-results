Frontend.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  didInsertElement: function() {

   var map = window.L.map('map').setView([-30.559482,  22.937505999999985], 6);

   // add an OpenStreetMap tile layer
   window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

    this.get('controller').send('drawOverlay');
  }
});