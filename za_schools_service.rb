require 'sinatra'
require 'mongoid'

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/countries/:id' do
  cache("countries") do
    country_results = MatricResult.ne(emis: "")
    passed = country_results.sum(:passed).to_i
    wrote = country_results.sum(:wrote).to_i
    {country: {id: 1, name: "South Africa", passed: passed, wrote: wrote}}.to_json
  end
end

get '/provinces' do
  # cache("provinces") do
    provinces = Province.all
    province_results = provinces.map do |province|
      {
        code: province.code,
        name: province.name,
        id: province.id,
        passed: province.matric_result("passed"),
        wrote: province.matric_result("wrote"),
        no_of_boys: 100
      }
    end
    {province: province_results}.to_json
  # end
end

get '/schools' do
  province_code = params[:province_code]
  cache_key = province_code ? "schools-#{province_code}" : "schools"

  # cache(cache_key) do
    schools = School.ne(gis_long: "").ne(gis_lat: "").and.ne(matric_result_emis: "")
    schools = schools.where(province_name: province_code) if province_code

    schools_results = schools.map do |school|
      matric_result = school.matric_result
      {
        name: school.school_name,
        lat: school.gis_lat,
        lng: school.gis_long,
        province_code: school.province_name,
        pass_rate: matric_result.pass_rate,
        passed: matric_result.passed,
        wrote: matric_result.wrote
      }
    end
    {schools: schools_results}.to_json
  # end
end

get '/sanitations' do
  schools = School.ne(sanitation_emis: "").and.ne(gis_long: "")
  sanitation = schools.map do |school|
  school_sanitation = school.school_sanitation
     {
        name: school.school_name,
        lat: school.gis_lat,
        lng: school.gis_long,
        no_of_boys: school_sanitation.no_of_boys,
        no_of_girls: school_sanitation.no_of_girls,
        total_toilets: school_sanitation.total_toilets,
        sanitation_plan: school_sanitation.sanitation_plan,
        construction: school_sanitation.construction,
        running_water: school_sanitation.running_water
      }
  end
  {sanitation: sanitation}.to_json
end

get '/province/:code/schools' do

  school_results = School.where(province_name: params[:code]).ne(matric_result_emis: "").and.ne(gis_lat: "")

  school_results = school_results.map do |school|
    matric_result = school.matric_result
    {
      name: school.school_name,
      lat: school.gis_lat,
      lng: school.gis_long,
      province_code: school.province_name,
      pass_rate: matric_result.pass_rate,
      passed: matric_result.passed,
      wrote: matric_result.wrote
    }
  end
  school_results.to_json
end

def cache(name, &block)
  client = IronCache::Client.new
  cache =  client.cache("za_schools_results")

  item = cache.get(name)
  if item
    value = item.value
  else
    value = yield
    cache.put(name, value)
  end
  value
end

class School
  include Mongoid::Document
  store_in collection: "school"

  field :emis, type: String
  field :gis_lat, type: String
  field :gis_lng, type: String
  field :school_name, type: String
  field :province_name, type: String
  field :matric_result_emis, type: String
  field :sanitation_emis, type: String

  def matric_result
    MatricResult.where(emis: self.matric_result_emis).first
  end

  def school_sanitation
    Sanitation.where(emis: self.sanitation_emis).first
  end

end

class Province
  include Mongoid::Document
  store_in collection: "province"

  field :id, type: Integer
  field :code, type: String
  field :name, type: String

  def matric_result(flag)
    schools = School.where(province_name: self.code).and.ne(matric_result_emis: "")
    result = 0
    if flag == "passed"
      schools.each { |school|
        result = result + MatricResult.where(emis: school.matric_result_emis).first.passed 
      }
    else
      schools.each { |school|
        result = result + MatricResult.where(emis: school.matric_result_emis).first.wrote 
      }
    end
    result
  end

  def no_of_boys
     schools = School.where(province_name: self.code).and.ne(sanitation_emis: "")
     boys = 0
     schools.each {|school|
      boys = boys + Sanitation.where(emis: school.sanitation_emis).first.no_of_boys
     }
     boys
  end
end

class MatricResult
 include Mongoid::Document
 store_in collection: "matric_results"

 field :emis, type: String
 field :wrote, type: Integer
 field :passed, type: Integer
 field :pass_rate, type: Integer

end

class Sanitation
 include Mongoid::Document
 store_in collection: "school_sanitation"

 field :emis, type: String
 field :no_of_boys, type: Integer
 field :no_of_girls, type: Integer
 field :total_toilets, type: Integer
 field :sanitation_plan, type: String
 field :construction, type: String
 field :running_water, type: String
end
