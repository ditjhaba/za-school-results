#! /usr/bin/env python

import xlrd
import csv
import sys

def select_columns_from_excel():
	headers = ['Test1', 'Test3']
	with open(sys.argv[1],'rb') as _in, open('output_file.csv','wb') as out:
	    reader = csv.DictReader(_in)
	    writer = csv.DictWriter(out, headers, extrasaction='ignore')
	    writer.writeheader()
	    for line in reader:
	        writer.writerow(line)

select_columns_from_excel()
