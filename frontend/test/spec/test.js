/*global describe, it */
'use strict';
(function () {
    describe('J&J testing', function () {
        describe('sanity check tests', function () {
            it('should add one and one together correctly', function (done) {
            	var onePlusOne = 1 + 1;
            	onePlusOne.should.equal(2);
            	done();
            });

            it('should add one and two together', function(done) {
            	var onePlusTwo = 1 + 2;
            	expect(onePlusTwo).to.equal(3);
            	done();
            });

            it('should add two and two together', function(done) {
            	var twoPlusTwo = 2 + 2;
            	assert.equal(twoPlusTwo, 4);
            	done();
            });
        });

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

			it('should retrieve the correct school from the controller', function(done){				
        		Frontend.reset();

        		Ember.run(function() {
	        		var adapter = Frontend.SchoolAdapter = DS.FixtureAdapter.extend({});
	        		var school;
	        		var store = DS.Store.create({
	        			revision: 12,
	        			adapter: adapter
	        		});

        			school = store.createRecord(Frontend.School, {
	        			id: '1',
				        name: 'Greg',
				        pass_rate: '50',
				        passed: '50',
				        wrote: '100',
				        lng: '30.0088',
				        lat: '54.7788',
				        province_code: 'EC'
	        		});

	        		var controller = Frontend.__container__.lookup('controller:admin');
	        		controller.set('model', [school]);
//	        		console.log(controller.get('model')[0].get('province_code'));
        		});

        		done();
			});
        });

        describe('AdminController tests', function(){
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

            it('should not shit itself if there are two schools with the same name', function(done) {
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
