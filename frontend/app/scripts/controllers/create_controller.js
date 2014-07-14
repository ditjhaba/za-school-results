Frontend.CreateController = Ember.ObjectController.extend({
    needs:['admin'],
    admin: Ember.computed.alias("controllers.admin"),

    actions:{

        create: function(){
            var school = {
              "emis": this.get('emis'),
              "name": this.get('name'),
              "town": this.get('town'),
              "address": this.get('address'),
              "province": this.get('province'),
              "no_of_boys": this.get('numberBoys'),
              "no_of_girls": this.get('numberGirls'),
              "total_toilets": this.get('totalToilets'),
              "running_water": this.get('runningWater'),
              "latitude": this.get('latitude'),
              "longitude": this.get('longitude')
            };

            this.set('school', school);
            var url = "school/create/" + JSON.stringify(school);
            Ember.$.post(url).then(function(school){
            });

            var admin = this.get('admin');
            admin.transitionToRoute('admin');
        }
    }
});