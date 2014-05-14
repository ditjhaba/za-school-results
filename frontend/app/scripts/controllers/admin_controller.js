Frontend.AdminController = Ember.ArrayController.extend({
	schoolNameSearch: '',
	schoolFound: '',
	performedSchoolSearch: false,
	actions: {
		filterByName: function () {
			var searchName = this.get('schoolNameSearch').toUpperCase();
			this.set('performedSchoolSearch', true);
			var retrievedName = this.filterBy('name', searchName);
			if(retrievedName.length !== 0) {
				this.set('schoolFound', retrievedName[0]);
			} else {
				this.set('schoolFound', '');
			}
		}
	},
});