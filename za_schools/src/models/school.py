"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


class School(object):
    """Defining an object that represents a school"""

    def __init__(self, emis, gis_lat="", gis_lng="", province_code=None,
                 province_name=None, matric_result_emis="", name=None,
                 no_fee_school=None, sanitation_emis="",
                 street_address=None, town=None, urban_rural=None):
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
