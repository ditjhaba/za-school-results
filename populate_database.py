import sys
import csv
import json

from pymongo import Connection

# *************************************************************************
# Data and Headers Files
# *************************************************************************
DATA_PATH = "parse_csv/resources/raw_data/"
matric_results_file = "{0}{1}".format(DATA_PATH, "sa_matric_school_results.csv")
matric_result_headers = "{0}{1}".format(DATA_PATH, "data_preparation/sa_matric_results_headers.csv")
# *************************************************************************

# *************************************************************************
# Establishing the connection and creating a database and collections 
# *************************************************************************
connection = Connection()
db = connection['za_schools_db']
matric_results = db['matric_results']
provinces = db['provinces']
sanitations = db['sanitations']
schools = db['schools']
# *************************************************************************


class Province(object):
	"""Defining an object that represents a province"""
	def __init__(self, _id, code=None, name=None, no_of_boys=None, 
		        no_of_girls=None, passed=None, pass_rate=None, running_water=None, 
		        sanitation_plan=None, total_toilets=None, wrote=None):
		self.code = code
		self._id = _id
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
				province_name=None, matric_result_emis=None, 
				sanitation_emis=None, street_address=None, town=None):
		self.emis = emis
		self.gis_lat = gis_lat
		self.gis_lng = gis_lng
		self.province_code = province_code
		self.province_name = province_name
		self.matric_result_emis = matric_result_emis
		self.sanitation_emis = sanitation_emis
		self.street_address = street_address
		self.town = town

def read_csv_files(headers_file, data_file):
	with open(headers_file, 'rb') as headers, open(data_file, 'rb') as data:
		header_data = [header for header in csv.reader(headers)]
		headers = header_data[0]
		input_data = csv.reader(data)

		for line in input_data:
			matric_result = MatricResult(emis=line[headers.index("emis")],
										passed=line[headers.index("2013_passed")],
										pass_rate=line[headers.index("2013_pass_rate")],
										wrote=line[headers.index("2013_wrote")])
			matric_results.insert(matric_result.__dict__)

# *************************************************************************
read_csv_files(matric_result_headers, matric_results_file)
# *************************************************************************
