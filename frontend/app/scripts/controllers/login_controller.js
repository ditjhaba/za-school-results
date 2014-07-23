Frontend.LoginController = Ember.ObjectController.extend({
  needs:['admin'],
  admin: Ember.computed.alias("controllers.admin"),
  loginFailed: false,

  actions: {
    login: function() {

      if ((this.get('username') == "NinaGabriels") && 
        (this.get('password') == "Nina@Grabriels_J&J.2014")) {
        
          var logs = {
                  "username": this.get('username'),
                  "password": this.get('password')
                };
                this.set('login', logs);
                var url = "login/" + JSON.stringify(logs);
                Ember.$.post(url).then(function(logs){
                });
                var admin = this.get('admin');
                admin.transitionToRoute('admin');
            }
        
        else {
          this.set('loginFailed', true);
          document.location = "/#/login";
              }
          }
    }
});
