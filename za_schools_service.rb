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
  cache("provinces") do
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
end

get '/schools' do
  province_code = params[:province_code]
  cache_key = province_code ? "schools-#{province_code}" : "schools"

  # cache(cache_key) do
    schools = School.ne(gis_long: "").and.ne(matric_result_emis: "")
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
    {school: schools_results}.to_json
  # end
end

get '/province/:code/schools' do
  province = Province.where(code: params[:code]).first

  schools_results = province.schools.map do |school|
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
  schools_results.to_json
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
  # has_one :result

  field :emis, type: String
  field :gis_lat, type: String
  field :gis_lng, type: String
  field :school_name, type: String
  field :province_name, type: String
  field :matric_result_emis, type: String

  def matric_result
    MatricResult.where(emis: self.matric_result_emis).first
  end

end

class Province
  include Mongoid::Document
  store_in collection: "province"

  field :id, type: Integer
  field :code, type: String
  field :name, type: String

  def schools
    School.where(province_name: self.code).ne(matric_result_emis: "").and.ne(gis_lat: "")
  end

  def passed_total
    schools.sum(:matric_results_2012_passed).to_i
  end

  def wrote_total
    schools.sum(:matric_results_2012_wrote).to_i
  end
end

class MatricResult
 include Mongoid::Document
 store_in collection: "matric_results"
 # belongs_to :school

 field :emis, type: String
 field :wrote, type: Integer
 field :passed, type: Integer
 field :pass_rate, type: Integer

end
