Frontend.CounterController = Ember.ObjectController.extend({
  actions: {
    startOdometer: function() {
      console.log("starting odometer");
      // this.set('model', this.store.createRecord('counter'));
      if(window.data_type === "display_matric_results") {
        this.createMatricResultsOdometer();  
      } 
      else {
        this.createSanitationInfoOdometer();
      }
    }
  },

  odometerPassedValueChanged: function() {
    window.$('.students-passed').html(this.get('passed'));
    window.$('.students-wrote').html(this.get('wrote'));
    window.$('.students-pass-rate').html(this.get('pass_rate'));
    window.$('.title').html(this.get('title'));
    window.$('.country').html(this.get('country'));
    window.$('.number-of-boys').html(this.get('no_of_boys'));
    window.$('.number-of-girls').html(this.get('number_of_girls'));
    window.$('.total-toilets').html(this.get('total_toilets'));
    window.$('.sanitation-plan').html(this.get('sanitation_plan'));
    window.$('.construction').html(this.get('construction'));
    window.$('.running-water').html(this.get('running_water'));
    window.$('.matric-year').html(this.get('matric_year'));
    window.$('.sanitation-year').html(this.get('sanitation_year'));
  }.observes('passed', 'wrote', 'pass_rate','title', 'no_of_boys', 'number_of_girls',
    'total_toilets', 'sanitation_plan', 'construction', 'running_water','country', 'sanitation_year', 'matric_year'),

  odometerFor: function(element, value) {
    Ember.run(this, function() {
        new window.Odometer({
        el: element,
        value: 0
      });
      element.innerHTML = value;
    });
  },

  createMatricResultsOdometer: function() {
    var el = document.querySelector('.students-pass-rate');
        this.odometerFor(el, this.get('pass_rate'));
        this.descriptionFor("students-pass-rate")

        el = document.querySelector('.students-passed');
        this.odometerFor(el, this.get('passed'));
        this.descriptionFor("students-passed")

        el = document.querySelector('.students-wrote');
        this.odometerFor(el, this.get('wrote'));
        this.descriptionFor("students-wrote")
  },

  createSanitationInfoOdometer: function() {
    var el = document.querySelector('.number-of-boys');
        this.odometerFor(el, this.get('no_of_boys'));
        this.descriptionFor("number-of-boys");

        var el = document.querySelector('.number-of-girls');
        this.odometerFor(el, this.get('no_of_girls'));
        this.descriptionFor("number-of-girls");

        var el = document.querySelector('.total-toilets');
        this.odometerFor(el, this.get('total_toilets'));
        this.descriptionFor("total-toilets");
  },

  descriptionFor: function(data) {
    var descriptionSpan = document.createElement("span");
    descriptionSpan.className = "description";
    var parent = document.getElementById(data);

    var cleanData = data.split("-").join(" ");
    var descriptionSpanContent = document.createTextNode(cleanData);

    descriptionSpan.appendChild(descriptionSpanContent);
    parent.appendChild(descriptionSpan);
  }
});






















