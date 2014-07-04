Frontend.EditController = Ember.ObjectController.extend({
        school:'',
        myBoolean: false,
        actions:{
            retrieve_school: function(){
                this.set('school', this.content);
                this.set('myBoolean', true);
                console.log(this.get('myBoolean'));
            },

            save: function(){
            }
        }
    }
);