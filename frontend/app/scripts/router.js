Frontend.Router.map(function () {
  this.route('provinces');
  this.route('counter');
  this.route('legend');
  this.resource('search');
  this.resource('sanitation');
  this.resource('health');
  this.resource('edit');
  this.resource('create');
  this.resource('upload');
  this.resource('login');
  this.resource('admin');
});
