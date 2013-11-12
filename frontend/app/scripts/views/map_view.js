Frontend.MapView = Ember.View.extend({
  id: 'map_canvas',
  tagName: 'div',

  didInsertElement: function() {
    Frontend.map = new window.GMaps({
      div: '#map',
      lat: -30.559482,
      lng: 22.937505999999985,
      zoom: 6,
      zoomControl : false,
      panControl : false,
      streetViewControl : false,
      mapTypeControl: false,
      overviewMapControl: false
    });
    this.get('controller').send('drawOverlay');
  }
});