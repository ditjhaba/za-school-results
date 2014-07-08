import csv
import json
import sys

from pymongo import Connection

# *************************************************************************
# Establishing mongo connection and creating a database and collections 
# *************************************************************************
connection = Connection()
db = connection['za_schools_db']
matric_results = db['matric_results']
provinces = db['provinces']
sanitations = db['sanitations']
schools = db['schools']
# *************************************************************************

# *************************************************************************
# Paths for Data and Header Files
# *************************************************************************
DATA_PATH = "parse_csv/resources/raw_data/"
matric_results_file = "{0}{1}".format(DATA_PATH, "sa_matric_school_results.csv")
matric_result_headers = "{0}{1}".format(DATA_PATH, "data_preparation/sa_matric_results_headers.csv")
# *************************************************************************
sanitations_file = "{0}{1}".format(DATA_PATH, "sa_sanitation.csv")
sanitation_headers = "{0}{1}".format(DATA_PATH, "data_preparation/sa_schools_sanitation_headers.csv")
# *************************************************************************
schools_file = "{0}{1}".format(DATA_PATH, "sa_schools_master_list.csv")
school_headers = "{0}{1}".format(DATA_PATH, "data_preparation/sa_schools_master_headers.csv")
# *************************************************************************
provinces_file = "{0}{1}".format(DATA_PATH, "sa_provinces.csv")
province_headers = "{0}{1}".format(DATA_PATH, "data_preparation/sa_provinces_headers.csv")
# *************************************************************************

class Province(object):
	"""Defining an object that represents a province"""
	def __init__(self, code, name=None, no_of_boys=None, 
		        no_of_girls=None, passed=None, pass_rate=None, running_water=None, 
		        sanitation_plan=None, total_toilets=None, wrote=None):
		self.code = code
		self.name = name
		self.no_of_boys = no_of_boys
		self.no_of_girls = no_of_girls
		self.passed = passed
		self.pass_rate = pass_rate
		self.running_water = running_water
		self.sanitation_plan = sanitation_plan
		self.total_toilets = total_toilets
		self.wrote = wrote

class MatricResult(object):
	"""Defining an object that represents a matric result"""
	def __init__(self, emis, passed=None, pass_rate=None, wrote=None):
		self.emis = emis
		self.passed = passed
		self.pass_rate = pass_rate
		self.wrote = wrote

class Sanitation(object):
	"""Defining an object that represents a sanitation"""
	def __init__(self, emis, construction=None, no_of_boys=None, 
				no_of_girls=None, running_water=None, 
				sanitation_plan=None, total_toilets=None):
		self.emis = emis
		self.construction = construction
		self.no_of_boys = no_of_boys
		self.no_of_girls = no_of_girls
		self.running_water = running_water
		self.sanitation_plan = sanitation_plan
		self.total_toilets = total_toilets
	
class School(object):
	"""Defining an object that represents a school"""
	def __init__(self, emis, gis_lat=None, gis_lng=None, province_code=None, 
				province_name=None, matric_result_emis=None, name=None, no_fee_school=None,
				sanitation_emis=None, street_address=None, town=None, urban_rural=None):
		self.emis = emis
		self.gis_lat = gis_lat
		self.gis_lng = gis_lng
		self.province_code = province_code
		self.province_name = province_name
		self.matric_result_emis = matric_result_emis
		self.name = name
		self.no_fee_school = no_fee_school
		self.sanitation_emis = sanitation_emis
		self.street_address = street_address
		self.town = town
		self.urban_rural = urban_rural

def read_csv_files(headers_file, data_file):
	with open(headers_file, 'rb') as headers, open(data_file, 'rb') as data:
		header_data = [header for header in csv.reader(headers)]
		headers = header_data[0]
		input_data = csv.reader(data)

		for line in input_data:

			if headers_file.__contains__("schools_sanitation"):
				populate_sanitations(line, headers)

			elif headers_file.__contains__("matric_results"):
				populate_matric_results(line, headers)

			elif headers_file.__contains__("schools_master"):
				populate_schools(line, headers)

			elif headers_file.__contains__("provinces"):
				populate_provinces(line, headers)
				

def populate_sanitations(data, header):
	sanitation = Sanitation(emis=data[header.index("emis")], 
							construction=data[header.index("construction")], 
							no_of_boys=data[header.index("boys")], 
							no_of_girls=data[header.index("girls")], 
							running_water=data[header.index("water")], 
							sanitation_plan=data[header.index("sanitation_plan")], 
							total_toilets=data[header.index("total_toilets_available")])
	sanitations.insert(sanitation.__dict__)
	
def populate_matric_results(data, header):
	matric_result = MatricResult(emis=data[header.index("emis")],
								passed=data[header.index("2013_passed")],
								pass_rate=data[header.index("2013_pass_rate")],
								wrote=data[header.index("2013_wrote")])
	matric_results.insert(matric_result.__dict__)

def populate_schools(data, header):
	emis = data[header.index("emis")]
	matric_result_emis = emis if matric_results.find({"emis": emis}).count()==1 else ""
	sanitation_emis = emis if sanitations.find({"emis": emis}).count()==1 else ""

	school = School(emis=emis,
					province_code=data[header.index("province_code")],
					province_name=data[header.index("province")],
					matric_result_emis=matric_result_emis,
					name=data[header.index("name")],
					gis_lng=data[header.index("gis_long")],
					gis_lat=data[header.index("gis_lat")],
					town=data[header.index("town_city")],
					sanitation_emis = sanitation_emis,
					street_address=data[header.index("street_address")],
					urban_rural=data[header.index("urban_rural")],
					no_fee_school=data[header.index("no_fee_school")])
	schools.insert(school.__dict__)

def populate_provinces(data, header):
	code = data[header.index("province")]
	prov_schools_matric_result = schools.find({"province_name": code, 
												"matric_result_emis": {"$ne": ""}})
	prov_schools_sanitation = schools.find({"province_name": code, 
												"sanitation_emis": {"$ne": ""}})

	prov_sanitations = province_sanitations(prov_schools_sanitation)
	prov_matric_results = province_matric_results(prov_schools_matric_result)
	
	province = Province(code=code, 
						name=data[header.index("province_long")],
						no_of_boys=prov_sanitations.get('no_of_boys'),
						no_of_girls=prov_sanitations.get('no_of_girls'),
						passed=prov_matric_results.get('passed'),
						pass_rate=prov_matric_results.get('pass_rate'),
						running_water=prov_sanitations.get('running_water'),
						total_toilets=prov_sanitations.get('total_toilets'),
						wrote=prov_matric_results.get('wrote'))
	provinces.insert(province.__dict__)

# *********************************************************************************
# Extracting matric results for a province given its list of schools
def province_matric_results(schools):
	wrote = 0
	passed = 0
	for school in schools:
		matric_result = matric_results.find_one({"emis": school.get('emis')})
		wrote += int(matric_result.get('wrote'))
		passed += int(matric_result.get('passed'))

	return {"wrote": wrote, "passed": passed, 
			"pass_rate": round((passed/float(wrote)) * 100, 2) if wrote!=0 else 0}
# *********************************************************************************

# *********************************************************************************
# Extracting sanitation data for a province given its list of schools
def province_sanitations(schools):
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

# *********************************************************************************
# Filter for bad data in sanitation table
def bad_data(value):
	return (value in ["Pit toilets", "VIP toilets", ""])
# *********************************************************************************
	
# *********************************************************************************
# Running the scripts to populate the 'za_schools' database and all its collections
# *********************************************************************************
read_csv_files(matric_result_headers, matric_results_file)
print "*************************************************************"
print "Loading Matric Results Data - Done"
print "*************************************************************"
read_csv_files(sanitation_headers, sanitations_file)
print "Loading Sanitations Data - Done"
print "*************************************************************"
read_csv_files(school_headers, schools_file)
print "Loading Schools Data - Done"
print "*************************************************************"
read_csv_files(province_headers, provinces_file)
print "Loading Provinces Data - Done"
print "*************************************************************"
# ********************************************************************************