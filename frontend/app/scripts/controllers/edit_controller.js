Frontend.EditController = Ember.ObjectController.extend({
        school:'',
        needs:['admin'],
        admin: Ember.computed.alias("controllers.admin"),
        actions:{
            retrieve_school: function() {
                this.set('school', this.content);
            },

            update: function(school){
                var url = "school/update/" + JSON.stringify(school);
                Ember.$.post(url).then(function(school){
                });

                var admin = this.get('admin');
                admin.transitionToRoute('admin');
            }
        }
    }
);