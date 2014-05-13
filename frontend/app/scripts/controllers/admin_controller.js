Frontend.AdminController = Ember.ArrayController.extend({
	schoolName: '',
	foundSchoolName: '',
	actions: {
		filterByName: function () {
			var schoolFound = this.filterBy('name', this.get('schoolName'));
			console.log(schoolFound[0].get('name'));
			return schoolFound;
		}
	},

	showSchool: function() {
		return this;
	}.property()
});