Frontend.CounterController = Ember.ObjectController.extend({
  actions: {
    startOdometer: function() {
      console.log("starting odometer");
      // this.set('model', this.store.createRecord('counter'));
      if(window.data_type === "display_matric_results") {
        var el = document.querySelector('.students-pass-rate');
        this.odometerFor(el, this.get('pass_rate'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("% students passed");
        span.appendChild(span_content);
        var li = document.getElementById("students-pass-rate");
        li.appendChild(span);

        el = document.querySelector('.students-passed');
        this.odometerFor(el, this.get('passed'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("students passed");
        span.appendChild(span_content);
        var li = document.getElementById("students-passed");
        li.appendChild(span);

        el = document.querySelector('.students-wrote');
        this.odometerFor(el, this.get('wrote'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("students wrote");
        span.appendChild(span_content);
        var li = document.getElementById("students-wrote");
        li.appendChild(span);
      } 
      else {
        var el = document.querySelector('.number-of-boys');
        this.odometerFor(el, this.get('no_of_boys'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("boys");
        span.appendChild(span_content);
        var li = document.getElementById("number-of-boys");
        li.appendChild(span);

        var el = document.querySelector('.number-of-girls');
        this.odometerFor(el, this.get('no_of_girls'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("girls");
        span.appendChild(span_content);
        var li = document.getElementById("number-of-girls");
        li.appendChild(span);

        var el = document.querySelector('.total-toilets');
        this.odometerFor(el, this.get('total_toilets'));
        var span = document.createElement("span");
        span.className = "description";
        var span_content = document.createTextNode("toilets");
        span.appendChild(span_content);
        var li = document.getElementById("total-toilets");
        li.appendChild(span);
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
  }
});