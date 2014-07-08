"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


class Sanitation(object):
    """Defining an object that represents a sanitation"""

    def __init__(self, emis, construction=None, no_of_boys=None,
                 no_of_girls=None, running_water=None,
                 sanitation_plan=None, total_toilets=None):
        self.emis = emis
        self.construction = construction
        self.no_of_boys = no_of_boys
        self.no_of_girls = no_of_girls
        self.running_water = running_water
        self.sanitation_plan = sanitation_plan
        self.total_toilets = total_toilets
