Frontend.SouthAfricaOverlayView = Ember.View.extend({
  tagName: 'div',

   didInsertElement: function() {
    var controller = this.get('controller');
    Ember.run.later(this, function(){
      controller.send('startOdometer');
    }, 200);
  }
});