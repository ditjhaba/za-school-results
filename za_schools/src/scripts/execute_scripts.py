import os

from constants.paths import Constants
from pymongo import Connection

Connection().drop_database('za_schools')

print "**********************************************************************"
print "Importing CSV Files"
print "**********************************************************************"
os.system("python import_csv.py {0} {1} {2}".format(
    Constants.MATRIC_RESULTS_FILE, Constants.MATRIC_RESULTS_HEADER,
    Constants.MATRIC_RESULTS_FILE))
print "Importing Matric Results CSV File - Done"
print "**********************************************************************"
os.system("python import_csv.py {0} {1} {2}".format(
    Constants.SANITATION_RAW_DATA_FILE, Constants.SANITATION_HEADERS,
    Constants.SANITATION_FILE))
print "Importing Sanitation CSV File - Done"
print "**********************************************************************"
os.system("python import_csv.py {0} {1} {2}".format(
    Constants.SCHOOLS_RAW_DATA_FILE, Constants.SCHOOL_HEADERS,
    Constants.SCHOOLS_FILE))
print "Importing School Master CSV File - Done"
print "**********************************************************************"
print "**********************************************************************"
print "Creating Connection"
print "**********************************************************************"
os.system("python ../../src/constants/create_connection.py")
print "**********************************************************************"
print "Populating Databases"
print "**********************************************************************"
os.system("python populate_databases.py")
print "**********************************************************************"
print "Indexing Databases"
print "**********************************************************************"
os.system("python database_structure.py")
print "**********************************************************************"