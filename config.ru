require 'rubygems'
require 'bundler/setup'
require './za_schools_service'

Bundler.require(:default)
Mongoid.load!("./config/mongoid.yml")
run Sinatra::Application
