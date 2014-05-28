#! /usr/bin/env python

import xlrd
import csv
import sys

def slice_data_from_excel():
	if len(sys.argv) == 3:
		with open(sys.argv[1], 'rb') as input_file, open(sys.argv[2], 'rb') as headers_file, open('output_file.csv', 'wb') as output_file:
				input_data = csv.DictReader(input_file)
				headers = [line for line in csv.reader(headers_file)]
				output_file = csv.DictWriter(output_file, headers[0], extrasaction='ignore')
				for line in input_data:
					output_file.writerow(line)
	else:
		print "usage: python import_csv.py <input_file> <headers_file>"

slice_data_from_excel()