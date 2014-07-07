from flask import Flask
from flask.ext.pymongo import PyMongo
from flask import jsonify
import json

app = Flask(__name__)
mongo = PyMongo(app)

from pymongo import Connection  
connection = Connection()  
db = connection.za_schools  
schools_sanitation = db.school_sanitation  
schools = db.school
provinces = db.province
matric_results = db.matric_results

@app.route('/countries/<id>')
def countries(id):
	provinces = [province for province in provinces.find()]
	sanitation = {
		'passed': sum_province_data("passed"),
		'wrote':  sum_province_data("wrote"),
		'no_of_boys': sum_province_data("no_of_boys"),
		'no_of_girls': sum_province_data("no_of_girls"),
		'total_toilets': sum_province_data("total_toilets")
	}

	return jsonify(results=sanitation)

def sum_province_data_for(key):
	data = provinces.aggregate([{ 
	   	    "$group": { 
	         "_id": "", 
	         "total": { "$sum": (("$%s")%(key)) } 
	      	}
		}])

	return data['result'][0]['total']
	
@app.route('/sanitations')
def sanitations():
	schools = [s for s in schools.find({"sanitation_emis": {"$ne": ""}, "gis_long": {"$ne": ""}})]
	sanitation_colletion = []
	
	for school in schools:
		sanitation = schools_sanitation.find_one({"emis": school['emis']})
		
		sanitation = {
	        'name': school['school_name'],
	        'lat': school['gis_lat'],
	        'lng': school['gis_long'],
	        'no_of_boys': sanitation['no_of_boys'],
	        'no_of_girls': sanitation['no_of_girls'],
	        'total_toilets': sanitation['total_toilets'],
	        'sanitation_plan': sanitation['sanitation_plan'],
	        'construction': sanitation['construction'],
	        'running_water': sanitation['running_water']
  		}

  		sanitation_colletion.append(sanitation)

	return jsonify(results=sanitation_colletion)

@app.route('/schools')
def schools():
	schools = [s for s in schools.find({"matric_result_emis": {"$ne": ""}, "gis_lat": {"$ne": ""}, "gis_long": {"$ne": ""}})]
	schools_collection = []
	
	for school in schools:
		matric_result = matric_results.find_one({"emis": school['emis']})

		school = {
	        'name': school['school_name'],
	        'lat': school['gis_lat'],
	        'lng': school['gis_long'],
	        'province_code': school['province_name'],
	        'pass_rate': matric_result['pass_rate'],
	        'passed': matric_result['passed'],
	        'wrote': matric_result['wrote']
  		}

  		schools_collection.append(school)

	return jsonify(results=schools_collection)

@app.route('/provinces')
def provinces():
	provinces = [province for province in provinces.find()]
	provinces_collection = []
	
	for province in provinces:
		province = {
        	'code': province['code'],
        	'name': province['name'],
        	'id': province['id'],
	        'passed': province['passed'],
	        'wrote': province['wrote'],
	        'pass_rate': province['pass_rate'],
	        'no_of_boys': province['no_of_boys'],
	        'no_of_girls': province['no_of_girls'],
	        'total_toilets': province['total_toilets'],
	        'running_water': province['running_water']
	    }

		provinces_collection.append(province)

	return jsonify(results=provinces_collection)

@app.route('/schools/<name>')
def schools_by_name(name):
	schools = [s for s in schools.find({"school_name": {"$regex": name.upper()}})]
	schools_collection = []
	
	for school in schools:
		matric_result = matric_results.find_one({"emis": school['emis']})
		sanitation = schools_sanitation.find_one({"emis": school['emis']})

		school = {
			'emis': school['emis'],
			'name': school['school_name'],
			'type_doe': school['type_doe'], 
			'lat': school['gis_lat'],
			'lng': school['gis_long'],
			'street_address': school['street_address'],
			'town': school['town_city'],
			'province_code': school['province_name'],
			'pass_rate': matric_result['pass_rate'] if matric_result  else "",
			'passed': matric_result['passed'] if matric_result else "",
			'wrote': matric_result['wrote'] if matric_result else "",
			'no_of_boys': sanitation.no_of_boys if sanitation else "",
			'no_of_girls': sanitation['no_of_girls'] if sanitation else "",
			'total_toilets': sanitation['total_toilets'] if sanitation else "",
			'sanitation_plan': sanitation['sanitation_plan'] if sanitation else "",
			'construction': sanitation['construction'] if sanitation else "",
			'running_water': sanitation['running_water'] if sanitation else "",
		}

		schools_collection.append(school)

	return jsonify(results=schools_collection)

@app.route('/provinces/<code>/schools')
def province_schools(code):
	schools = [s for s in schools.find({"province_name": code, "matric_result_emis": {"$ne": ""}, "gis_lat": {"$ne": ""}})]
	schools_collection = []

	for school in schools:
		matric_result = matric_results.find_one({"emis": school['emis']})
		sanitation = schools_sanitation.find_one({"emis": school['emis']})

		school = {
			'name': school['school_name'],
	  		'lat': school['gis_lat'],
	    	'lng': school['gis_long'],
      		'province_code': school['province_name'],
	  		'pass_rate': matric_result['pass_rate'],
	  		'passed': matric_result['passed'],
	  		'wrote': matric_result['wrote'],
	  		'no_of_boys': sanitation['no_of_boys'] if sanitation else "unknown",
	  		'no_of_girls': sanitation['no_of_girls'] if sanitation else "unknown",
	  		'total_toilets': sanitation['total_toilets'] if sanitation else "unknown",
	  		'sanitation_plan': sanitation['sanitation_plan'] if sanitation else "unknown",
	  		'running_water': sanitation['running_water'] if sanitation else "unknown",
	  		'construction': sanitation['construction'] if sanitation else "unknown" 
		}

		schools_collection.append(school)

	return jsonify(results=schools_collection)	

def strip_id(collection):
	for item in collection:
		del s['_id']

if __name__ == '__main__':
	app.run() 