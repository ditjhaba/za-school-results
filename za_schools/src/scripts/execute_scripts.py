import os

from constants.constant import Constants, Paths
from pymongo import Connection

Connection().drop_database('za_schools')
print "Dropping Existing Database - Done"
print Constants.LINE
print "Importing CSV Files"
print Constants.LINE
os.system("python import_csv.py {0} {1} {2}".format(
    Paths.MATRIC_RESULTS_RAW_DATA_FILE, Paths.MATRIC_RESULTS_HEADER,
    Paths.MATRIC_RESULTS_FILE))
print "1. Importing Matric Results CSV File - Done"
print Constants.LINE
os.system("python import_csv.py {0} {1} {2}".format(
    Paths.SANITATION_RAW_DATA_FILE, Paths.SANITATION_HEADERS,
    Paths.SANITATION_FILE))
print "2. Importing Sanitation CSV File - Done"
print Constants.LINE
os.system("python import_csv.py {0} {1} {2}".format(
    Paths.SCHOOLS_RAW_DATA_FILE, Paths.SCHOOL_HEADERS,
    Paths.SCHOOLS_FILE))
print "3. Importing Schools Master CSV File - Done"
print Constants.LINE
print "Creating Connection"
os.system("python ../../src/constants/create_connection.py")
print Constants.LINE
print "Populating Database"
os.system("python populate_databases.py")
print Constants.LINE
print "Indexing Database"
print Constants.LINE
os.system("python database_structure.py")
print Constants.LINE