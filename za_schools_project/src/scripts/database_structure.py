from constants.create_connection import matric_results, sanitations, schools

print "******************************************************"
matric_results.create_index("emis")
print "Creating Indices For Matric Results - Done"
print "******************************************************"
sanitations.create_index("emis")
print "Creating Indices For Sanitations - Done"
print "******************************************************"
schools.create_index("emis")
print "Creating Indices For Schools - Done"
print "******************************************************"