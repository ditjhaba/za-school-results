import unittest
import schools_service

class SchoolServiceTest(unittest.TestCase):

	def setUp(self):
		self.app = schools_service.app.test_client()

	def test_should_return_a_list_of_matric_results(self):
		url = self.app.get('/')
		self.assertIn(url.data, 'Hello World!!!')

	def test_should_retrieve_all_sanitation_data(self):
		url = self.app.get('/sanitation')
		print url.data[101]
		self.assertEqual(len(url.data), 89)

	def test_something(self):
		pass