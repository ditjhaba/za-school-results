#! /usr/bin/env python

import csv
import sys
from constants.constant import Constants


def slice_data_from_csv():
    if len(sys.argv) == 4:
        with open(sys.argv[1], 'rU') as input_file, \
            open(sys.argv[2], 'rU') as headers_file, \
            open(sys.argv[3],
                 'w') as output_file:

            input_data = csv.DictReader(input_file)
            headers = [line for line in csv.reader(headers_file)]
            output_file = csv.DictWriter(output_file, headers[0],
                                         extrasaction='ignore')
            k = 0
            for line in input_data:
                if k >= 1:
                    output_file.writerow(line)
                k += 1
    else:
        print Constants.LINE
        print "usage: python import_csv.py <input_file> " \
              "<headers_file> <output_file>"
        print Constants.LINE

slice_data_from_csv()