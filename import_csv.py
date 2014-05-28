#! /usr/bin/env python

import xlrd
import csv
import sys

def slice_data_from_csv():
	if len(sys.argv) == 3:
		with open(sys.argv[1], 'rb') as input_file, open(sys.argv[2], 'rb') as headers_file, open('output_file.csv', 'wb') as output_file:
				input_data = csv.DictReader(input_file)
				headers = [line for line in csv.reader(headers_file)]
				output_file = csv.DictWriter(output_file, headers[0], extrasaction='ignore')
				k=0
				for line in input_data:
					if k>=1:
						output_file.writerow(line)
					k += 1
	else:
		print "********************************************************"
		print "usage: python import_csv.py <input_file> <headers_file>"
		print "********************************************************"

slice_data_from_csv()