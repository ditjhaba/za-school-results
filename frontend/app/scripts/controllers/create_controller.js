Frontend.CreateController = Ember.ObjectController.extend({
    needs:['admin'],
    admin: Ember.computed.alias("controllers.admin"),
//    emis:'',
//    name: '',
//    town: '',
//    province: '',
//    numberBoys: '',
//    numberGirls: '',
//    totalToilets: '',
//    runningWater: '',
//    latitude: '',
//    longitude: '',

    actions:{

        create: function(){
            var emis = this.get('emis');
            var name = this.get('name');
            var town = this.get('town');
            var province = this.get('province');
            var numberBoys = this.get('numberBoys');
            var numberGirls = this.get('numberGirls');
            var totalToilets = this.get('totalToilets');
            var runningWater = this.get('runningWater');
            var latitude = this.get('latitude');
            var longitude = this.get('longitude');

            var school = {"emis": this.get('emis')};

            this.set('school', school);
            var url = "school/create/" + JSON.stringify(school);
//            var url = "school/create/" + school;
            Ember.$.post(url).then(function(school){
            });

            var admin = this.get('admin');
            admin.transitionToRoute('admin');
        }
    }
});