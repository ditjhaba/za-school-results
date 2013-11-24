var Frontend = window.Frontend = Ember.Application.create();

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');


window.odometerOptions = {
  auto: false, // Don't automatically initialize everything with class 'odometer'
  format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  duration: 300, // Change how long the javascript expects the CSS animation to take
  animation: 'count' // Count is a simpler animation method which just increments the value,
};
