Frontend.Router.map(function () {
  this.route('provinces');
  this.route('counter');
  this.route('legend');
  this.resource('admin');
  this.resource('sanitation');
  this.resource('health');
  this.resource('edit');
  this.resource('create');
  this.resource('upload');
  this.resource('login');
  this.resource('home');
});
