"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from constants.create_connection import matric_results, sanitations, \
    schools

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