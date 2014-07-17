from pymongo import Connection

from constants.constant import Constants

# *************************************************************************
# Establishing mongo connection and creating a database and collections 
# *************************************************************************

connection = Connection()
db = connection[Constants.DATABASE_NAME]
matric_results = db[Constants.MATRIC_RESULTS_COLLECTION]
provinces = db[Constants.PROVINCES_COLLECTION]
sanitations = db[Constants.SANITATIONS_COLLECTION]
schools = db[Constants.SCHOOLS_COLLECTION]
