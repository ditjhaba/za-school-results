Frontend.AdminController = Ember.ArrayController.extend({
	schoolNameSearch: '',
	schoolFound: '',
	performedSchoolSearch: false,
	actions: {
		filterByName: function () {
			var searchName = this.get('schoolNameSearch').toUpperCase();
			this.set('performedSchoolSearch', true);
            var url = "schools/" + searchName;
            var that = this;
            Ember.$.getJSON(url).then(function(retrievedSchools){
	            if(retrievedSchools.length !== 0) {
	                that.set('schoolFound', retrievedSchools.school);
				} else {
					that.set('schoolFound', null);
				}
            });
		}
	}
});