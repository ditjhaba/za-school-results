require 'sinatra'
require 'mongoid'

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/countries/:id' do
  country_results = School.ne(matric_results_2012_passed: "")
  passed = country_results.sum(:matric_results_2012_passed).to_i
  wrote = country_results.sum(:matric_results_2012_wrote).to_i
  {country: {id: 1, name: "South Africa", passed: passed, wrote: wrote}}.to_json
end

get '/provinces' do
  provinces = Province.all
  province_results = provinces.map do |province|
    {
      code: province.code,
      name: province.name,
      id: province.id,
      passed: province.passed_total,
      wrote: province.wrote_total
    }
  end
  {province: province_results}.to_json
end

get '/schools' do
  schools = School.ne(gis_long: "").and.ne(matric_results_2012_passed: "")
  schools_results = schools.map do |school|
    {
      name: school.school_name,
      pass_rate: school.matric_results_2012_percent_passed,
      lat: school.gis_lat,
      lng: school.gis_long,
      province_code: school.province_name
    }
  end
  {school: schools_results}.to_json
end

class School
  include Mongoid::Document
  store_in collection: "school"

  field :matric_results_2012_passed, type: Integer
  field :matric_results_2012_wrote, type: Integer
  field :matric_results_2012_percent_passed, type: Float
  field :gis_lat, type: String
  field :gis_lng, type: String
  field :school_name, type: String
  field :province_name, type: String
end

class Province
  include Mongoid::Document
  store_in collection: "province"

  field :id, type: Integer
  field :code, type: String
  field :name, type: String

  def schools
    School.where(province_name: self.code).and.ne(matric_results_2012_passed: "")
  end

  def passed_total
    schools.sum(:matric_results_2012_passed).to_i
  end

  def wrote_total
    schools.sum(:matric_results_2012_wrote).to_i
  end
end
