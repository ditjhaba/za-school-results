(defproject za_schools "0.1.0-SNAPSHOT"
  :description "Visualize matric pass rates in South Africa"
  :url "http://github.com"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [
                  [org.clojure/clojure "1.5.1"]
                  [clojure-csv/clojure-csv "2.0.1"]
                  [compojure "1.1.6"]
                  [com.novemberain/monger "1.5.0"]]
  :resource-paths ["resources"]
  :main za-schools.core
  :profiles {:uberjar {:aot :all}})
