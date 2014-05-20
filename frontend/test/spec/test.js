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
        		var theSchool;

        		var store = DS.Store.create({
        			revision: 12,
        			adapter: adapter
        		});

        		Ember.run(this, function(){ 
        			theSchool = store.createRecord(Frontend.School, {
	        			id: '1',
				        name: 'Greg',
				        pass_rate: '50',
				        passed: '50',
				        wrote: '100',
				        lng: '30.0088',
				        lat: '54.7788',
				        province_code: 'EC'
	        		});
	        		
	        		// theSchool = store.find('school');
	        	});

        		console.log(theSchool.get('name'));

        		done();
        	});
        });
    });
})();
