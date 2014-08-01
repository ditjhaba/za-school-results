"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


class Paths(object):
    """Paths for Data and Header Files"""

    DATA_PATH = "../../data/schools_data/"
    RAW_DATA_PATH = "../../data/raw_data/"
    HEADER_PATH = "../../data/headers/"

    ADMIN_FILE = "{0}{1}".format(RAW_DATA_PATH, "admin_login.csv")

    MATRIC_RESULTS_FILE = "{0}{1}".format(DATA_PATH,
                                          "sa_matric_school_results.csv")

    MATRIC_RESULTS_HEADER = "{0}{1}".format(HEADER_PATH,
                                            "sa_matric_results_headers.csv")

    MATRIC_RESULTS_RAW_DATA_FILE = "{0}{1}".format(RAW_DATA_PATH,
                                                   "sa_matric_results.csv")

    SANITATION_FILE = "{0}{1}".format(DATA_PATH, "sa_sanitation.csv")
    SANITATION_HEADERS = "{0}{1}".format(HEADER_PATH,
                                         "sa_schools_sanitation_headers.csv")

    SANITATION_RAW_DATA_FILE = "{0}{1}".format(RAW_DATA_PATH,
                                               "sa_schools_sanitation.csv")

    SCHOOLS_FILE = "{0}{1}".format(DATA_PATH,
                                   "sa_schools_master_list.csv")
    SCHOOL_HEADERS = "{0}{1}".format(HEADER_PATH,
                                     "sa_schools_master_headers.csv")
    SCHOOLS_RAW_DATA_FILE = "{0}{1}".format(RAW_DATA_PATH,
                                            "sa_schools_master_2013.csv")

    PROVINCES_FILE = "{0}{1}".format(DATA_PATH, "sa_provinces.csv")
    PROVINCES_RAW_DATA_FILE = "{0}{1}".format(RAW_DATA_PATH,
                                              "sa_schools_province_data.csv")
    PROVINCE_HEADERS = "{0}{1}".format(HEADER_PATH,
                                       "sa_provinces_headers.csv")


class Constants(object):
    """General Constants"""

    ADMIN_COLLECTION = 'admin'
    # local database
    # DATABASE_NAME = 'za_schools'
    
    #Remote/production database
    DATABASE_NAME = 'app19456176'
    LINE = "****************************************************************"
    MATRIC_RESULTS_COLLECTION = 'matric_results'
    PROVINCES_COLLECTION = 'provinces'
    SANITATIONS_COLLECTION = 'sanitations'
    SCHOOLS_COLLECTION = 'schools'