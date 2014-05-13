Frontend.AdminController = Ember.ArrayController.extend({
	schoolNameSearch: '',
	schoolNameFound: '',
	performedSchoolSearch: false,
	actions: {
		filterByName: function () {
			this.set('performedSchoolSearch', true);
			var retrievedName = this.filterBy('name', this.get('schoolNameSearch'));
			if(retrievedName.length !== 0) {
				this.set('schoolNameFound', retrievedName[0].get('name'));
			} else {
				this.set('schoolNameFound', '');
			}
		}
	},

	schools: function() {
		return this;
	}.property()
});