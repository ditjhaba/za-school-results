#! /usr/bin/env python
import math
import pymongo
from pymongo import MongoClient

# *************************************************************************
# This script is used to compute and insert matric results data in the 
# province table
# *************************************************************************

# *************************************************************************
# Connecting to the database to pull up all necessary tables 
client = MongoClient('localhost', 27017)
db = client.za_schools
schools = db.school
matric_results = db.matric_results
provinces = db.province
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

	return {"wrote": wrote, "passed": passed, "pass_rate": round((passed/float(wrote)) * 100, 2)}
# *************************************************************************

# *************************************************************************
# Extracting provinces data and update it with the new matric result fields
def update_provinces():
	for province in provinces.find():
		province_schools = schools.find({"province_name": province.get("code"), "matric_result_emis": {"$ne": ""}})
		matric_result = province_matric_results(province_schools)
		provinces.update({"_id": province.get("_id")}, 
						 {"$set": {"wrote": matric_result.get("wrote"), 
									"passed": matric_result.get("passed"), 
									"pass_rate": matric_result.get("pass_rate")}})
# *************************************************************************
# Executing the process
update_provinces()
# *************************************************************************
