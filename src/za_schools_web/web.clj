(ns za_schools_web.web
  (:use compojure.core)
  (:use cheshire.core)
  (:use ring.util.response)
  (:use ring.middleware.gzip)
  (:use monger.operators)
  (:use [monger.conversion :only [from-db-object]])
  (:require [compojure.core :refer [defroutes GET PUT POST DELETE ANY]]
            [compojure.handler :refer [site]]
            [compojure.route :as route]
            [clojure.java.io :as io]
            [ring.middleware.stacktrace :as trace]
            [ring.middleware.session :as session]
            [ring.middleware.session.cookie :as cookie]
            [ring.middleware.json :as middleware]
            [ring.adapter.jetty :as jetty]
            [ring.middleware.basic-authentication :as basic]
            [cemerick.drawbridge :as drawbridge]
            [monger.core :as mg]
            [environ.core :refer [env]]
            [monger.core :as mg]
            [monger.collection :as mc]
            [monger.json :as json]
            [cheshire.core :refer :all])


  (:import [org.bson.types ObjectId]
           [com.mongodb DB WriteConcern]))


(defn- authenticated? [user pass]
  ;; TODO: heroku config:add REPL_USER=[...] REPL_PASSWORD=[...]
  (= [user pass] [(env :repl-user false) (env :repl-password false)]))

(def ^:private drawbridge
  (-> (drawbridge/ring-handler)
      (session/wrap-session)
      (basic/wrap-basic-authentication authenticated?)))

(def db-url "http://localhost:7474/db/data/")

(defn db-connect
  []
  (mg/connect-via-uri! (env :mongohq-url)))

(defn get-country
  [id]
  (db-connect)
  (let [res (mc/aggregate "school" [ {$group
                                      {
                                        :_id nil
                                        :passed {$sum "$matric_results_2012_passed" }
                                        :wrote {$sum "$matric_results_2012_wrote"}
                                    }}])]
    (response {:country (merge {:id 1 :name "South Africa"} (nth res 0))})))

(defn get-provinces-results
  [province]
  (db-connect)
  (let [res (mc/aggregate "school" [
                                    {
                                    $group  {
                                                :_id "$province_name"
                                                :passed {$sum "$matric_results_2012_passed" }
                                                :wrote {$sum "$matric_results_2012_wrote"}
                                            }

                                    }
                                    { $match { :_id (get province :code) } }
                                  ])]

    (merge province (nth res 0))))

(defn get-provinces
  []
  (db-connect)
  (let [results (mc/find-maps "province")]
    (response {:province (map get-provinces-results results) })))


(defn school-to-ember
  [school]
    {
      :lat (get school :gis_lat)
      :lng (get school :gis_long)
      :pass_rate (get school :matric_results_2012_percent_passed)
      :name (get school :school_name)
      :province_code (get school :province_name)
    })

(defn get-schools []
  (db-connect)
  (let [res (mc/find-maps "school" {:gis_long {$ne ""} :matric_results_2012_passed {$ne ""}})]
    (response {:school (map school-to-ember res)})))

(defroutes app
  (ANY "/repl" {:as req}
       (drawbridge req))

  (GET "/" []
       {:status 200
        :headers {"Content-Type" "text/html"}
        :body (slurp (io/resource "public/index.html"))})

  (context "/countries" [] (defroutes countries-routes
    (GET "/:id" [id] (get-country id))))

  (context "/provinces" [] (defroutes provinces-routes
    (GET "/" [] (get-provinces))))

  (context "/schools" [] (defroutes schools-routes
    (GET "/" [] (get-schools))))

  (ANY "*" []
       (route/resources "/")))

(defn wrap-error-page [handler]
  (fn [req]
    (try (handler req)
         (catch Exception e
           {:status 500
            :headers {"Content-Type" "text/html"}
            :body (slurp (io/resource "500.html"))}))))

(defn -main [& [port]]
  (let [port (Integer. (or port (env :port) 5000))
        ;; TODO: heroku config:add SESSION_SECRET=$RANDOM_16_CHARS
        store (cookie/cookie-store {:key (env :session-secret)})]
    (jetty/run-jetty (-> #'app
                         ((if (env :production)
                            wrap-error-page
                            trace/wrap-stacktrace))
                            middleware/wrap-json-body
                            middleware/wrap-json-response
                            wrap-gzip
                         (site {:session {:store store}}))
                     {:port port :join? false})))

;; For interactive development:
;; (.stop server)
;; (def server (-main))
