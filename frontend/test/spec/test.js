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
	        		var school1, school2;
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

	        		var controller = Frontend.__container__.lookup('controller:admin');
	        		controller.set('model', [school1, school2]);
	        		controller.set('schoolNameSearch', 'Greg');
	        		controller.send('filterByName');
	        		expect(controller.get('schoolFound').get('name')).to.equal('GREG');
        		});
				
        		done();
			});
        });

		describe('AdminController tests', function(){
			var store, controller, school1, school2;

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
	        		controller = Frontend.__container__.lookup('controller:admin');
	        		controller.set('model', [school1, school2]);
				});
			});

			it('Can filter a school based on name', function(done) {
				Ember.run(this, function() {
					controller.set('schoolNameSearch', 'Greg');
	        		controller.send('filterByName');
	        		expect(controller.get('schoolFound').get('name')).to.equal('GREG');
				});
				done();
			}),

			it('Should understand when school is not found must return null', function(done) {
				Ember.run(this, function() {
					controller.set('schoolNameSearch', 'kljfkldj');
	        		controller.send('filterByName');
	        		expect(controller.get('schoolFound')).is.null;
				});
				done();
			})


		});
    });
})();
