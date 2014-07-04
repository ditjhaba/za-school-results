Frontend.Router.map(function () {
  this.route('provinces');
  this.route('counter');
  this.route('legend');
  this.resource('admin');
  this.resource('sanitation');
  this.resource('health');
  this.resource('edit');
});
