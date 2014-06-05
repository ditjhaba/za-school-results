Frontend.Sanitation = DS.Model.extend({
    name: DS.attr(),
    lat: DS.attr(),
    lng: DS.attr(),
    no_of_boys: DS.attr(),
    no_of_girls: DS.attr(),
    total_toilets: DS.attr(),
    sanitation_plan: DS.attr(),
    construction: DS.attr(),
    running_water: DS.attr()
});