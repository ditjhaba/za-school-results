Frontend.School = DS.Model.extend({
    name: DS.attr(),
    pass_rate: DS.attr(),
    lng: DS.attr(),
    lat: DS.attr(),

    fillColor: function() {
      var d = this.get('pass_rate');

      return d > 80  ?  '#47A103' :
             d > 60   ? '#E8DA04' :
             d > 40   ? '#FFB707' :
             d > 20   ? '#E86605' :
                        '#FF2B12';
    }.property('fillColor')
});