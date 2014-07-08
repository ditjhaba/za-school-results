"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


class Province(object):
    """Defining an object that represents a province"""

    def __init__(self, code, name=None, no_of_boys=None,
                 no_of_girls=None, passed=None, pass_rate=None,
                 running_water=None, sanitation_plan=None,
                 total_toilets=None, wrote=None):
        self.code = code
        self.name = name
        self.no_of_boys = no_of_boys
        self.no_of_girls = no_of_girls
        self.passed = passed
        self.pass_rate = pass_rate
        self.running_water = running_water
        self.sanitation_plan = sanitation_plan
        self.total_toilets = total_toilets
        self.wrote = wrote
