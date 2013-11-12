Frontend.SouthAfricaOverlayView = Ember.View.extend({
  classNames: ['south-africa', 'odometer'],
  tagName: 'div',

   didInsertElement: function() {
    var controller = this.get('controller');
    Ember.run.later(this, function(){
      controller.send('startOdometer');
    }, 200);
  }
});