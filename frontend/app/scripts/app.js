var Frontend = window.Frontend = Ember.Application.create();

Frontend.rootElement = "#qunit-fixture"
Frontend.setupForTesting();
Frontend.injectTestHelpers();

/* Order and include as you please. */
['scripts/controllers/*',
'scripts/store',
'scripts/models/*',
'scripts/routes/*',
'scripts/views/*',
'scripts/router']


window.odometerOptions = {
  auto: false, // Don't automatically initialize everything with class 'odometer'
  format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  duration: 300, // Change how long the javascript expects the CSS animation to take
  animation: 'count' // Count is a simpler animation method which just increments the value,
};
