Frontend.School = DS.Model.extend({
    name: DS.attr(),
    pass_rate: DS.attr(),
    lng: DS.attr(),
    lat: DS.attr(),

    fillColor: function() {
      var d = this.get('pass_rate');

      return d > 80  ?  '#288DF6' :
             d > 60   ? '#23D36D' :
             d > 40   ? '#D2EA32' :
             d > 20   ? '#EDA321' :
                        '#F62B19';
    }.property('fillColor')
});