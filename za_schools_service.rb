require 'sinatra'
require 'mongoid'

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/countries/:id' do
  # cache("countries") do
    provinces = Province.all
    passed = provinces.sum(:passed)
    wrote = provinces.sum(:wrote)
    no_of_boys = provinces.sum(:no_of_boys)
    no_of_girls = provinces.sum(:no_of_girls)
    total_toilets  = provinces.sum(:total_toilets)
    running_water = provinces.sum(:running_water)/provinces.count

    {country: {id: 1, name: "South Africa", passed: passed, wrote: wrote, no_of_boys: no_of_boys,
     no_of_girls: no_of_girls, total_toilets: total_toilets, running_water: running_water}}.to_json
  # end
end

get '/provinces' do
  # cache("provinces") do
    provinces = Province.all 
    province_results = provinces.map do |province|
      {
        code: province.code,
        name: province.name,
        id: province.id,
        passed: province.passed,
        wrote: province.wrote,
        pass_rate: province.pass_rate,
        no_of_boys: province.no_of_boys,
        no_of_girls: province.no_of_girls,
        total_toilets: province.total_toilets,
        running_water: (province.running_water).to_f
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

get '/all_schools' do
  schools = School.all().each do |school|
    matric_result = school.matric_result
    {
      emis: school.emis,
      name: school.school_name,
      lat: school.gis_lat,
      lng: school.gis_long,
      province_code: school.province_name,
      address: school.street_address,
      specialization: school.specilization,
      district: school.magisterial_district,
      town_city: school.town_city,
      type_doe: school.type_doe
    }
  end 
  {schools: schools}.to_json
end

get '/sanitations' do
  schools = School.ne(sanitation_emis: "").and.ne(gis_long: "")
  sanitation = schools.map do |school|
  school_sanitation = school.sanitation
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
    sanitation = school.sanitation
    {
      name: school.school_name,
      lat: school.gis_lat,
      lng: school.gis_long,
      province_code: school.province_name,
      pass_rate: matric_result.pass_rate,
      passed: matric_result.passed,
      wrote: matric_result.wrote,
      no_of_boys: sanitation != nil ? sanitation.no_of_boys : "unknown",
      no_of_girls: sanitation != nil ? sanitation.no_of_girls : "unknown",
      total_toilets: sanitation != nil ? sanitation.total_toilets : "unknown",
      sanitation_plan: sanitation != nil ? sanitation.sanitation_plan : "unknown",
      running_water: sanitation != nil ? sanitation.running_water : "unknown",
      construction: sanitation != nil ? sanitation.construction : "unknown" 
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

  def sanitation
    Sanitation.where(emis: self.sanitation_emis).first
  end

end

class Province
  include Mongoid::Document
  store_in collection: "province"

  field :id, type: Integer
  field :code, type: String
  field :name, type: String
  field :wrote, type: Integer
  field :passed, type: Integer
  field :pass_rate, type: Float
  field :no_of_boys, type: Integer
  field :no_of_girls, type: Integer
  field :total_toilets, type: Integer
  field :running_water, type: Integer

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
