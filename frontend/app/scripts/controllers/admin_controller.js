Frontend.AdminController = Ember.ArrayController.extend({
	schoolName: '',
	foundSchoolName: '',
	actions: {
		filterByName: function () {
			this.set('foundSchoolName', this.filterBy('name', this.get('schoolName'))[0].get('name'));
			// console.log(schoolFound[0].get('name'));
			// return schoolFound;
		}
	},

	// showSchool: function() {
	// 	return this;
	// }.property()
});