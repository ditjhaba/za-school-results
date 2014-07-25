Frontend.EditController = Ember.ObjectController.extend({
        school:'',
        needs:['search'],
        search: Ember.computed.alias("controllers.search"),
        actions:{
            retrieve_school: function() {
                this.set('school', this.get(''));
            },

            update: function(school){
                var url = "school/update/" + JSON.stringify(school);
                Ember.$.post(url).then(function(school){
                });

                var search = this.get('search');
                search.transitionToRoute('search');
            }
        }
    }
);