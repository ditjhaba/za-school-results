from pymongo import Connection

from constants.constant import Constants

# *************************************************************************
# Establishing mongo connection and creating a database and collections 
# *************************************************************************

#connect to the remote/production database
connection = Connection("mongodb://greg:realpassword@paulo.mongohq.com:10047/app19456176", 10047)
#connect to the localhost database
# connection = Connection()

db = connection[Constants.DATABASE_NAME]
matric_results = db[Constants.MATRIC_RESULTS_COLLECTION]
provinces = db[Constants.PROVINCES_COLLECTION]
sanitations = db[Constants.SANITATIONS_COLLECTION]
schools = db[Constants.SCHOOLS_COLLECTION]
admin = db[Constants.ADMIN_COLLECTION]