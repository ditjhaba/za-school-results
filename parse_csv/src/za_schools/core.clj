(ns za-schools.core
  (:gen-class)
   (:require  [clojure-csv.core :as csv]
              [monger.core :as mg]
              [clojure.java.io :as io])
   (:use [monger.core :only [connect! connect set-db! get-db]]
         [monger.collection :only [insert insert-batch]])
   (:import [org.bson.types ObjectId]
            [com.mongodb DB WriteConcern]))

(defn take-csv
    "Takes file name and reads data."
    [fname]
    (csv/parse-csv (slurp fname)))

(defn get-provinces
  "parse the provinces csv file"
  [& args]
  (take-csv (io/resource "raw_data/school_data_provinces_2013.csv")))

(defn get-master-data
  "parse the master csv file"
  [& args]
  (take-csv (io/resource "raw_data/school_data_master_2013.csv")))

(defn save-province
  [province]
  (let [province-map

    { :_id (ObjectId.)
      :id (nth province 0)
      :code (nth province 1)
      :name (nth province 2)}]

  (insert "province" province-map)))

(defn parse-provinces
  []
  (doseq [province-data (rest (get-provinces))]
    (save-province province-data)))

(defn str2no [str]
  (if-not (clojure.string/blank? str)
    (let [n (read-string str)]
       (if (number? n) n ""))
    ""
    ))

(defn build-data-master
  [dm]
    {
      :province_id (nth dm 2)
      :province_name (nth dm 3)
      :school_name (nth dm 4)
      :school_short_name (nth dm 5)
      :sector (nth dm 7)
      :type_doe (nth dm 8)
      :phase_doe (nth dm 9)
      :specilization (nth dm 10)
      :gis_long (nth dm 11)
      :gis_lat (nth dm 12)
      :latitude (nth dm 13)
      :longitude (nth dm 14)
      :magisterial_district (nth dm 15)
      :town_city (nth dm 16)
      :steet_address (nth dm 17)
      :urban_rural (nth dm 22)
      :section21 (nth dm 23)
      :no_fee_school (nth dm 24)
      :matric_results_2012_entered (str2no (nth dm 85))
      :matric_results_2012_wrote (str2no (nth dm 86))
      :matric_results_2012_passed (str2no (nth dm 87))
      :matric_results_2012_percent_passed (str2no (nth dm 88))
    })

(defn parse-data-master
  []
  (doseq [data-master-data (rest (rest (get-master-data)))]
    (insert "school" (build-data-master data-master-data))))

(defn -main
  "Parse school data master files"
  [& args]
  (mg/connect!)
  (mg/set-db! (mg/get-db "za_schools"))
  (parse-provinces)
  (println "Parsing provinces done")
  (parse-data-master)
  (println "Parsing master data done")
)


