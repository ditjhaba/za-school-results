(ns za_schools_web.web
  (:use compojure.core)
  (:use cheshire.core)
  (:use ring.util.response)
  (:use ring.middleware.gzip)
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
            [environ.core :refer [env]]
            [clojurewerkz.neocons.rest :as nr]
            [clojurewerkz.neocons.rest.nodes :as nn]
            [clojurewerkz.neocons.rest.relationships :as nrl]
            [clojurewerkz.neocons.rest.cypher :as cy]))

(defn- authenticated? [user pass]
  ;; TODO: heroku config:add REPL_USER=[...] REPL_PASSWORD=[...]
  (= [user pass] [(env :repl-user false) (env :repl-password false)]))

(def ^:private drawbridge
  (-> (drawbridge/ring-handler)
      (session/wrap-session)
      (basic/wrap-basic-authentication authenticated?)))

(def db-url "http://localhost:7474/db/data/")

(defn get-country
  [id]
  (nr/connect! db-url)
  (let [res (cy/tquery "START n=node(*) WHERE HAS(n.matric_results_2012_passed) AND n.matric_results_2012_passed <> '' RETURN SUM(n.matric_results_2012_passed) AS passed, SUM(n.matric_results_2012_wrote) AS wrote")]
    (response {:country (merge {:id 1 :name "South Africa"} (nth res 0))})))


(defn get-province-results
  [province]
  (nr/connect! db-url)
  (let [res (cy/tquery "START n=node(*)
                        WHERE HAS(n.province_id)
                        AND n.province_id={pid} AND HAS(n.matric_results_2012_wrote)
                        AND n.matric_results_2012_wrote <> ''
                        RETURN SUM(n.matric_results_2012_wrote) AS wrote,
                        SUM(n.matric_results_2012_passed) AS passed" {:pid (str (get province "id"))})]
    (merge (nth res 0) province)))

(defn get-provinces
  []
  (nr/connect! db-url)
  (let [res (cy/tquery "START n=node(*) WHERE HAS(n.code) AND HAS(n.name) RETURN n.id AS id, n.name AS name, n.code AS code")]
      (response {:province (map get-province-results res)})))

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
