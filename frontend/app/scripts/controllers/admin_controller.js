Frontend.AdminController = Ember.ArrayController.extend({
	schoolNameSearch: '',
	schoolFound: '',
	performedSchoolSearch: false,
	actions: {
		filterByName: function () {
			this.set('performedSchoolSearch', true);
			var retrievedName = this.filterBy('name', this.get('schoolNameSearch'));
			if(retrievedName.length !== 0) {
				this.set('schoolFound', retrievedName[0]);
			} else {
				this.set('schoolNameFound', '');
			}
		}
	},
});