Frontend.School = DS.Model.extend({
    name: DS.attr(),
    pass_rate: DS.attr(),
    passed: DS.attr(),
    wrote: DS.attr(),
    lng: DS.attr(),
    lat: DS.attr(),
    province_code: DS.attr(),
    emis: DS.attr(),
    type_doe: DS.attr(),
    street_address: DS.attr(),
    town: DS.attr(),
    no_of_boys: DS.attr(),
    no_of_girls: DS.attr(),
    total_toilets: DS.attr(),
    sanitation_plan: DS.attr(),
    construction: DS.attr(),
    running_water: DS.attr(),

    fillColor: function() {
      var d = this.get('pass_rate');

      return d > 80  ?  '#47A103' :
             d > 60   ? '#E8DA04' :
             d > 40   ? '#FFB707' :
             d > 20   ? '#E86605' :
                        '#FF2B12';
    }.property('fillColor')
});
