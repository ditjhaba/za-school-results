(defproject za_schools_web "1.0.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://za_schools_web.herokuapp.com"
  :main za_schools_web.web
  :license {:name "FIXME: choose"
            :url "http://example.com/FIXME"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [compojure "1.1.6"]
                 [ring/ring-json "0.2.0"]
                 [ring/ring-jetty-adapter "1.1.0"]
                 [ring/ring-devel "1.1.0"]
                 [ring-basic-authentication "1.0.1"]
                 [environ "0.2.1"]
                 [com.cemerick/drawbridge "0.0.6"]
                 [org.clojars.mikejs/ring-gzip-middleware "0.1.0-SNAPSHOT"]
                 [com.novemberain/monger "1.5.0"]
                 [cheshire "5.1.1"]]
  :min-lein-version "2.0.0"
  :plugins [[environ/environ.lein "0.2.1"]]
  :hooks [environ.leiningen.hooks]
  :profiles {:production {:env {:production true}}})
