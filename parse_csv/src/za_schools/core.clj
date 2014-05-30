(ns za-schools.core
  (:gen-class)
   (:require  [clojure-csv.core :as csv]
              [monger.core :as mg]
              [clojure.java.io :as io]
              [environ.core :refer [env]])
   (:use [monger.core :only [connect! connect set-db! get-db]]
         [monger.collection :only [insert insert-batch]])
   (:import [org.bson.types ObjectId]
            [com.mongodb DB WriteConcern]))

(defn take-csv
    "Takes file name and reads data."
    [fname]
    (csv/parse-csv (slurp fname) :delimiter \,))

(defn get-provinces
  "parse the provinces csv file"
  [& args]
  (take-csv (io/resource "raw_data/sa_schools_province_data.csv")))

(defn get-master-data
  "parse the master csv file"
  [& args]
  (take-csv (io/resource "raw_data/sa_schools_master_list.csv")))

(defn get-school-results
  "parse the school result csv file"
  [& args]
  (take-csv (io/resource "raw_data/sa_matric_school_results.csv")))

(defn save-province
  [province]
  (let [province-map

    { :_id (ObjectId.)
      :id (nth province 0)
      :code (nth province 1)
      :name (nth province 2)}]

  (insert "province" province-map)))

(defn save-school-results
  [school_results]
  (let [school_results-map
  {
    :_id (ObjectId.)
    :emis (nth school_results 0)
    :wrote (nth school_results 1)
    :passed (nth school_results 2)
    :pass_rate (nth school_results 3)}]

    (insert "school_results" school_results-map)))



(defn parse-provinces
  []
  (doseq [province-data (rest (get-provinces))]
    (save-province province-data)))

(defn parse-school-results
  []
  (doseq [school-results-data (rest (get-school-results))]
    (save-school-results school-results-data)))

(defn str2no [str]
  (if-not (clojure.string/blank? str)
    (let [n (read-string str)]
       (if (number? n) n ""))
    ""
    ))

(defn build-data-master
  [dm]
    {
      :province_id (nth dm 0)
      :province_name (nth dm 1)
      :school_name (nth dm 2)
      :school_short_name (nth dm 3)
      :sector (nth dm 4)
      :type_doe (nth dm 5)
      :phase_doe (nth dm 6)
      :specilization (nth dm 7)
      :gis_long (nth dm 8)
      :gis_lat (nth dm 9)
      :latitude (nth dm 10)
      :longitude (nth dm 11)
      :magisterial_district (nth dm 12)
      :town_city (nth dm 13)
      :steet_address (nth dm 14)
      :urban_rural (nth dm 15)
      :section21 (nth dm 16)
      :no_fee_school (nth dm 17)
    })

(defn parse-data-master
  []
  (doseq [data-master-data (rest (rest (get-master-data)))]
    (insert "school" (build-data-master data-master-data))))

(defn -main
  "Parse school data master files"
  [& args]
  (mg/connect-via-uri! (env :mongohq-url))
  (parse-provinces)
  (println "Parsing provinces done")
  (parse-data-master)
  (println "Parsing master data done")
  (parse-school-results)
  (println "Parsing school results done")
)
