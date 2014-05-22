/*global describe, it */
'use strict';

(function(){
    describe('Admin Controller Test', function(){
        describe('Test retrieval and filtering of schools', function(){
            var store, controller, school1, school2,school3;

            beforeEach(function() {
                Ember.run(this, function() {
                    var adapter = Frontend.SchoolAdapter = DS.FixtureAdapter.extend({});
                    var school;
                    var store = DS.Store.create({
                        revision: 12,
                        adapter: adapter
                    });
                    school1 = store.createRecord(Frontend.School, {
                        id: '1',
                        name: 'GREG',
                        pass_rate: '50',
                        passed: '50',
                        wrote: '100',
                        lng: '30.0088',
                        lat: '54.7788',
                        province_code: 'EC'
                    });
                    school2 = store.createRecord(Frontend.School, {
                        id: '2',
                        name: 'DJ',
                        pass_rate: '40',
                        passed: '40',
                        wrote: '100',
                        lng: '30.9888',
                        lat: '14.7788',
                        province_code: 'GA'
                    });
                    school3 = store.createRecord(Frontend.School, {
                        id: '3',
                        name: 'DJ',
                        pass_rate: '60',
                        passed: '60',
                        wrote: '100',
                        lng: '30.9888',
                        lat: '44.7788',
                        province_code: 'GP'
                    });
                    controller = Frontend.__container__.lookup('controller:admin');
                    controller.set('model', [school1, school2, school3]);
                });
            });

            it('should find a school if it exists', function(done) {
                Ember.run(this, function() {
                    controller.set('schoolNameSearch', 'Greg');
                    controller.send('filterByName');
                    expect(controller.get('schoolFound')[0].get('name')).to.equal('GREG');
                });
                done();
            }),

                it('return null if the school does not exist', function(done) {
                    Ember.run(this, function() {
                        controller.set('schoolNameSearch', 'non_existent_school');
                        controller.send('filterByName');
                        expect(controller.get('schoolFound')).is.null;
                    });
                    done();
                }),

                it('should retrieve all schools with the same name', function(done) {
                    Ember.run(this, function(){
                        controller.set('schoolNameSearch', 'DJ');
                        controller.send('filterByName');
                        expect(controller.get('schoolFound').length).to.equal(2);
                    });
                    done();
                })
        });
    });
})();