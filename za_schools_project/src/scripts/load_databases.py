"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import csv

from constants.paths import Constants
from constants.connection import matric_results, provinces, \
    sanitations, schools
from models.matric_result import MatricResult
from models.province import Province
from models.sanitation import Sanitation
from models.school import School


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
                            sanitation_plan=data[
                                header.index("sanitation_plan")],
                            total_toilets=data[
                                header.index("total_toilets_available")])
    sanitations.insert(sanitation.__dict__)


def populate_matric_results(data, header):
    matric_result = MatricResult(emis=data[header.index("emis")],
                                 passed=data[header.index("2013_passed")],
                                 pass_rate=data[
                                     header.index("2013_pass_rate")],
                                 wrote=data[header.index("2013_wrote")])
    matric_results.insert(matric_result.__dict__)


def populate_schools(data, header):
    emis = data[header.index("emis")]
    matric_result_emis = emis if matric_results.find(
        {"emis": emis}).count() == 1 else ""
    sanitation_emis = emis if sanitations.find(
        {"emis": emis}).count() == 1 else ""

    school = School(emis=emis,
                    province_code=data[header.index("province_code")],
                    province_name=data[header.index("province")],
                    matric_result_emis=matric_result_emis,
                    name=data[header.index("name")],
                    gis_lng=data[header.index("gis_long")],
                    gis_lat=data[header.index("gis_lat")],
                    town=data[header.index("town_city")],
                    sanitation_emis=sanitation_emis,
                    street_address=data[header.index("street_address")],
                    urban_rural=data[header.index("urban_rural")],
                    no_fee_school=data[header.index("no_fee_school")])
    schools.insert(school.__dict__)


def populate_provinces(data, header):
    code = data[header.index("province")]
    prov_schools_matric_result = schools.find({"province_name": code,
                                               "matric_result_emis": {
                                                   "$ne": ""}})
    prov_schools_sanitation = schools.find({"province_name": code,
                                            "sanitation_emis": {"$ne": ""}})

    prov_sanitation = province_sanitations(prov_schools_sanitation)
    prov_matric_results = province_matric_results(prov_schools_matric_result)

    province = Province(code=code,
                        name=data[header.index("province_long")],
                        no_of_boys=prov_sanitation.get('no_of_boys'),
                        no_of_girls=prov_sanitation.get('no_of_girls'),
                        passed=prov_matric_results.get('passed'),
                        pass_rate=prov_matric_results.get('pass_rate'),
                        running_water=prov_sanitation.get('running_water'),
                        total_toilets=prov_sanitation.get('total_toilets'),
                        wrote=prov_matric_results.get('wrote'))
    provinces.insert(province.__dict__)


def province_matric_results(schools):
    """Extracting matric results for a province given its list of schools"""
    wrote = 0
    passed = 0
    for school in schools:
        matric_result = matric_results.find_one({"emis": school.get('emis')})
        wrote += int(matric_result.get('wrote'))
        passed += int(matric_result.get('passed'))

    return {"wrote": wrote, "passed": passed,
            "pass_rate": round((passed / float(wrote)) * 100,
                               2) if wrote != 0 else 0}


def province_sanitations(schools):
    """Extracting sanitation data for a province given its list of schools"""
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
        if sanitation.get('running_water') in ["Yes",
                                               "Yes "]:
        # In our data there are schools with running water "Yes" and "Yes "
            running_water = running_water + 1

    return {"no_of_boys": no_of_boys, "no_of_girls": no_of_girls,
            "total_toilets": total_toilets,
            "running_water": (float(running_water) / schools.count()) * 100
            if schools.count() != 0 else running_water}


def bad_data(value):
    """Filter for bad data in sanitation table"""
    return (value in ["Pit toilets", "VIP toilets", ""])

#Running the scripts to populate the 'za_schools' database and collections"""
read_csv_files(Constants.MATRIC_RESULTS_HEADER, Constants.MATRIC_RESULTS_FILE)
print "*************************************************************"
print "Loading Matric Results Data - Done"
print "*************************************************************"
read_csv_files(Constants.SANITATION_HEADERS, Constants.SANITATION_FILE)
print "Loading Sanitations Data - Done"
print "*************************************************************"
read_csv_files(Constants.SCHOOL_HEADERS, Constants.SCHOOLS_FILE)
print "Loading Schools Data - Done"
print "*************************************************************"
read_csv_files(Constants.PROVINCE_HEADERS, Constants.PROVINCES_FILE)
print "Loading Provinces Data - Done"
print "*************************************************************"
