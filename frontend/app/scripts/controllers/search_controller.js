Frontend.SearchController = Ember.ArrayController.extend({
  needs:['edit'],
  edit: Ember.computed.alias("controllers.edit"),
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
		},

        edit: function(school){
            var edit = this.get('edit');
            edit.set('model', school);
            edit.send('retrieve_school');
            edit.transitionToRoute('edit');
        }

	}
});