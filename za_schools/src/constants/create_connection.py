from pymongo import Connection

# *************************************************************************
# Establishing mongo connection and creating a database and collections 
# *************************************************************************
connection = Connection()
db = connection['za_schools']
matric_results = db['matric_results']
provinces = db['provinces']
sanitations = db['sanitations']
schools = db['schools']
# *************************************************************************
