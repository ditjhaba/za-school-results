Frontend.LoginController = Ember.ObjectController.extend({
  needs:['search'],
  needs:['admin'],
  search: Ember.computed.alias("controllers.search"),
  admin: Ember.computed.alias("controllers.admin"),
  loginFailed: false,

  actions: {
    login: function() {

      var logs = {
        "username": this.get('username'), 
        "password": this.get('password')};

      var url = "login/" + JSON.stringify(logs);
      var that = this;

      Ember.$.getJSON(url).then(function(loginDetails){
              if(loginDetails.hasOwnProperty("admin")) {
                  Ember.$.post(url).then(function(logs){
                });
                var admin = that.get('admin');
                admin.transitionToRoute('admin');
              } 
              else {
                  that.set('loginFailed', true);
                  document.location = "/#/login"
                    }
        });


      }
    }
});
