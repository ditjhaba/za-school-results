#! /usr/bin/env python
import os
import math
import pymongo
from pymongo import MongoClient

# *************************************************************************
# This script is used to compute and insert matric results and sanitation 
# data into the province table
# *************************************************************************

# *************************************************************************
# Connecting to the database to pull up all necessary tables 
MONGO_URL = os.environ.get('MONGOHQ_URL')
client = MongoClient(MONGO_URL)
db = client.za_schools
# When running on the prod DB: db = client.app19456176
schools = db.school
sanitations = db.school_sanitation
matric_results = db.matric_results
provinces = db.province

# *************************************************************************
# Filter for bad data in sanitation table
BAD_DATA = ["Pit toilets", "VIP toilets", ""]
def bad_data(value):
	return (value in BAD_DATA)
# *************************************************************************

# *************************************************************************
# Extracting matric results for a province given its list of schools
def province_matric_results(schools):
	wrote = 0
	passed = 0
	for school in schools:
		matric_result = matric_results.find_one({"emis": school.get('emis')})
		wrote += int(matric_result.get('wrote'))
		passed += int(matric_result.get('passed'))

	return {"wrote": wrote, "passed": passed, 
			"pass_rate": round((passed/float(wrote)) * 100, 2)}
# *************************************************************************


# *************************************************************************
# Extracting sanitation data for a province given its list of schools
def province_sanitation(schools):
	no_of_boys = 0
	no_of_girls = 0
	total_toilets = 0
	running_water = 0

	for school in schools:
		sanitation = sanitations.find_one({"emis": school.get('emis')})
		if not bad_data(sanitation.get('no_of_boys')):
			no_of_boys += int(sanitation.get('no_of_boys'))
		if not bad_data(sanitation.get('no_of_girls')):
			no_of_girls += int(sanitation.get('no_of_girls'))
		if not bad_data(sanitation.get('total_toilets')):
			total_toilets += int(sanitation.get('total_toilets'))
		
		if sanitation.get('running_water') in ["Yes", "Yes "]: # In our data there are schools with running water "Yes" and "Yes "
			running_water = running_water + 1

	return {"no_of_boys": no_of_boys, "no_of_girls": no_of_girls, "total_toilets": total_toilets, 
			"running_water": (float(running_water)/schools.count()) * 100 if schools.count()!=0 else running_water}
#*************************************************************************

# *************************************************************************

# Extracting provinces data and update it with the new matric result fields
def update_province_matric_results():
	print "updating provinces"
	for province in provinces.find():
		province_schools = schools.find({"province_name": province.get("code"), "matric_result_emis": {"$ne": ""}})
		matric_result = province_matric_results(province_schools)
		provinces.update({"_id": province.get("_id")}, 
						 {"$set": {"wrote": matric_result.get("wrote"), 
									"passed": matric_result.get("passed"), 
									"pass_rate": matric_result.get("pass_rate")}})
	print "updating provinces done"
# *************************************************************************

# *************************************************************************
# Extracting provinces data and update it with the new matric result fields
def update_province_sanitation():
	for province in provinces.find():
		print "updating province sanitation"
		province_schools = schools.find({"province_name": province.get("code"), "sanitation_emis": {"$ne": ""}})
		sanitation = province_sanitation(province_schools)
		provinces.update({"_id": province.get("_id")}, 
						 {"$set": {"no_of_boys": sanitation.get("no_of_boys"),
									"no_of_girls": sanitation.get("no_of_girls"),
									"total_toilets": sanitation.get("total_toilets"),
									"running_water": round(sanitation.get("running_water"), 2)}})
	print "updating province sanitation done"
# *************************************************************************
# Executing the process
print "**************************"
# update_province_matric_results()
update_province_sanitation()
# *************************************************************************

# *************************************************************************
# Analysis for duplicate records using school_name
# *************************************************************************

# map = """function(){
#    if(this.school_name) {
#    emit(this.school_name, 1);}
# }"""

# reduce = """function(key, values){
#     return Array.sum(values);
# }"""

# db.school.map_reduce(map, reduce, "map_reduce_values")
# for school in db.map_reduce_values.find({"value": {"$gt": 1}}):
# 	db.duplicate_schools.insert(school)
