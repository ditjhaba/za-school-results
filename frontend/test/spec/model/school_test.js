/*global describe, it */
'use strict';

(function(){
    describe('School model tests', function(){
        describe('School model tests', function() {
            it('should have the name attribute', function(done) {
                var attribute = Frontend.School.metaForProperty('name');
                expect(attribute.isAttribute).to.equal(true, 'Expected ttribute');
                done();
            });

            it('should retain a name attribute', function(done) {

                var adapter = Frontend.SchoolAdapter = DS.FixtureAdapter.extend({});
                var school;

                var store = DS.Store.create({
                    revision: 12,
                    adapter: adapter
                });

                Ember.run(this, function(){
                    store.createRecord(Frontend.School, {
                        id: '1',
                        name: 'Greg',
                        pass_rate: '50',
                        passed: '50',
                        wrote: '100',
                        lng: '30.0088',
                        lat: '54.7788',
                        province_code: 'EC'
                    });

                    store.createRecord(Frontend.School, {
                        id: '2',
                        name: 'DJ',
                        pass_rate: '50',
                        passed: '50',
                        wrote: '100',
                        lng: '30.0088',
                        lat: '54.7788',
                        province_code: 'EC'
                    });

                    school = store.find(Frontend.School,2);
                });

                expect(school.get('name')).to.equal('DJ');
                expect(school.get('name')).to.not.equal('Greg');

                done();
            });

        });
    });
})();