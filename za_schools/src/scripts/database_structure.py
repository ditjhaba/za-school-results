"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from constants.constant import Constants
from constants.create_connection import matric_results, sanitations, \
    schools

matric_results.create_index("emis")
print "1. Creating Indices For Matric Results - Done"
print Constants.LINE
sanitations.create_index("emis")
print "2. Creating Indices For Sanitations - Done"
print Constants.LINE
schools.create_index("emis")
print "3. Creating Indices For Schools - Done"
