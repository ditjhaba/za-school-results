(ns za-schools.core
  (:gen-class)
   (:require  [clojure-csv.core :as csv]
              [monger.core :as mg]
              [clojure.java.io :as io]
              [environ.core :refer [env]])
   (:use [monger.core :only [connect! connect set-db! get-db]]
         [monger.collection :only [insert insert-batch create-index]])
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

(defn get-matric-results
  "parse the school result csv file"
  [& args]
  (take-csv (io/resource "raw_data/sa_matric_school_results.csv")))

(defn get-sanitation-data
  "parse the school sanitation data csv file "
  [& args]
  (take-csv (io/resource "raw_data/sa_sanitation.csv")))

(defn save-province
  [province]
  (let [province-map

    { :_id (ObjectId.)
      :id (nth province 0)
      :code (nth province 1)
      :name (nth province 2)}]

  (insert "province" province-map)))

(defn save-matric-results
  [matric_results]
  (let [matric-results-map
  {
    :_id (ObjectId.)
    :emis (nth matric_results 0)
    :wrote (nth matric_results 1)
    :passed (nth matric_results 2)
    :pass_rate (nth matric_results 3)}]

    (insert "matric_results" matric-results-map)))

;using the 'rest' here in order to keep the province data intact
(defn parse-provinces
  []
  (doseq [province-data (rest (get-provinces))] 
    (save-province province-data)))

(defn parse-matric-results
  []
  (doseq [matric-results-data (get-matric-results)]
    (save-matric-results matric-results-data)))

(defn str2no [str]
  (if-not (clojure.string/blank? str)
    (let [n (read-string str)]
       (if (number? n) n ""))
    ""
    ))

(defn build-data-master
  [dm, matric_results, sanitation]
  (def matric_result_emis "")
  (doseq [mr matric_results] (if (= (nth mr 0) (nth dm 0)) (def matric_result_emis (nth dm 0))))
  (def sanitation_emis "")
  (doseq [sd sanitation] (if (= (nth sd 0) (nth dm 0)) (def sanitation_emis (nth sd 0))))
    {
      :emis (nth dm 0)
      :province_id (nth dm 1)
      :province_name (nth dm 2)
      :school_name (nth dm 3)
      :school_short_name (nth dm 4)
      :sector (nth dm 5)
      :type_doe (nth dm 6)
      :phase_doe (nth dm 7)
      :specilization (nth dm 8)
      :gis_long (nth dm 9)
      :gis_lat (nth dm 10)
      :latitude (nth dm 11)
      :longitude (nth dm 12)
      :magisterial_district (nth dm 13)
      :town_city (nth dm 14)
      :street_address (nth dm 15)
      :urban_rural (nth dm 16)
      :section21 (nth dm 17)
      :no_fee_school (nth dm 18)
      :matric_result_emis matric_result_emis
      :sanitation_emis sanitation_emis
    })

(defn build-sanitation-data
  [sd]
  {
    :emis (nth sd 0)
    :no_of_boys (nth sd 1)
    :no_of_girls (nth sd 2)
    :total_toilets (nth sd 3)
    :sanitation_plan (nth sd 4)
    :construction (nth sd 5)
    :running_water (nth sd 6)
    })

(defn parse-data-master
  [matric_results, sanitation]
  (doseq [data-master-data (get-master-data)]
    (insert "school" (build-data-master data-master-data matric_results sanitation))))

(defn parse-sanitation-data
  []
  (doseq [sanitation-data (get-sanitation-data)]
    (insert "school_sanitation" (build-sanitation-data sanitation-data))))

(defn create-indeces
  [db, collection, column]
  (monger.collection/create-index collection {column 1}))

(defn -main
  "Parse school data master files"
  [& args]
  (mg/connect-via-uri! (env :mongohq-url))
  (def matric_results (get-matric-results))
  (def sanitation (get-sanitation-data))
  (parse-provinces)
  (println "Parsing provinces done")
  (parse-data-master matric_results sanitation)
  (println "Parsing master data done")
  (parse-matric-results)
  (println "Parsing matric results done")
  (parse-sanitation-data)
  (println "Parsing sanitation data done")
  (println "Creating matric_results indices")
  (create-indeces (mg/get-db "za-schools") "matric_results" "emis")
  (println "Creating school indices")
  (create-indeces (mg/get-db "za-schools") "school" "emis")
  (println "Creating sanitation indices")
  (create-indeces (mg/get-db "za-schools") "school_sanitation" "emis")
)







