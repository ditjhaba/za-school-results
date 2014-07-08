"""
Copyright 2014 J&J Digital Project

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""


class MatricResult(object):
    """Defining an object that represents a matric result"""

    def __init__(self, emis, passed=None, pass_rate=None, wrote=None):
        self.emis = emis
        self.passed = passed
        self.pass_rate = pass_rate
        self.wrote = wrote
