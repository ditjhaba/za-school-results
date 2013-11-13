Frontend.IndexRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
    // store.createRecord('province', { name: 'KwaZulu-Natal', index: 0, id: 1});
    // store.createRecord('province', { name: 'Free State', index: 1, id: 2});
    // store.createRecord('province', { name: 'Eastern Cape', index: 2, id: 3} );
    // store.createRecord('province', { name: "Mpumalanga", index: 3, id: 4});
    // store.createRecord('province', { name: "Limpopo", index: 4, id: 5});
    // store.createRecord('province', { name: "Northern Cape", index: 5, id: 6});
    // store.createRecord('province', { name: "North West", index: 6, id: 7});
    // store.createRecord('province', { name: "Western Cape", index: 7, id: 8});
    // store.createRecord('province', { name: "Gauteng", index: 8, id: 9});
    return store.find('country', 1);
    // return store.findAll('province');
  }
});
