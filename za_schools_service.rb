require 'sinatra'
require 'mongoid'
require 'JSON'

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
        running_water: province.running_water
      }
    end
    {province: province_results}.to_json
  # end
end

get '/schools' do
  province_code = params[:province_code]
  cache_key = province_code ? "schools-#{province_code}" : "schools"

  # cache(cache_key) do
    schools = School.ne(gis_lng: nil).ne(gis_lat: nil).and.ne(matric_result_emis: "")
    schools = schools.where(province_name: province_code) if province_code

    schools_results = schools.map do |school|
      matric_result = school.matric_result
      {
        name: school.name,
        lat: school.gis_lat,
        lng: school.gis_lng,
        province_code: school.province_name,
        pass_rate: matric_result ? matric_result.pass_rate : "",
        passed: matric_result ? matric_result.passed : "",
        wrote: matric_result ? matric_result.wrote : ""
      }
    end
    {schools: schools_results}.to_json
  # end
end

post '/school/update/:school' do
  param = params[:school]
  school_params = JSON.parse(param)

  school = School.where(emis: school_params['emis']).first
  sanitation = school.sanitation 

  school.name = school_params['name']
  school.type_doe = school_params['type_doe']
  school.gis_lat = school_params['lat']
  school.gis_lng = school_params['lng']
  school.province_name = school_params['province_code']
  school.street_address = school_params['street_address']
  school.town = school_params['town']
  school.save

  if sanitation != nil
    sanitation.no_of_boys = school_params['no_of_boys']
    sanitation.no_of_girls = school_params['no_of_girls']
    sanitation.running_water = school_params['running_water']
    sanitation.sanitation_plan = school_params['sanitation_plan']
    sanitation.construction = school_params['construction']
    sanitation.total_toilets = school_params['total_toilets']
    sanitation.save

  elsif check_sanitation_data(school_params)
    new_sanitation = Sanitation.new(emis: school_params['emis'], 
                                    no_of_boys: school_params['no_of_boys'], 
                                    no_of_girls: school_params['no_of_girls'],
                                    running_water: school_params['running_water'],
                                    construction: school_params['construction'],
                                    sanitation_plan: school_params['sanitation_plan'],
                                    total_toilets: school_params['total_toilets'])
    new_sanitation.save
    school.sanitation_emis = school_params['emis']
    school.save
  end
end

post '/school/create/:school' do
  param = params[:school]
  school_params = JSON.parse(param)

  if School.where(emis: school_params['emis']).first == nil
    school = School.new(emis: school_params['emis'],
                        name: school_params['name'] ? school_params['name'].upcase : "",
                        gis_lat: school_params['latitude'],
                        gis_lng: school_params['longitude'],
                        province_name: school_params['province'],
                        street_address: school_params['address'],
                        town_city: school_params['town'],
                        matric_result_emis: "")
    school.save
    if check_sanitation_data(school_params)
      new_sanitation = Sanitation.new(emis: school_params['emis'], 
                                      no_of_boys: school_params['no_of_boys'], 
                                      no_of_girls: school_params['no_of_girls'],
                                      running_water: school_params['running_water'],
                                      construction: school_params['construction'],
                                      sanitation_plan: school_params['sanitation_plan'],
                                      total_toilets: school_params['total_toilets'])
      new_sanitation.save
      school.sanitation_emis = school_params['emis']
      school.save
    
    end
  end
end

post '/login/:logs' do
  param = params[:logs]
  login_details = JSON.parse(param)

  if authenticate(login_details)
    redirect '/#/admin'
  end
  
end

def authenticate(login)
  login['username'] == "NinaGabriels" and login['password'] == "Nina@Grabriels_J&J.2014"
end


get '/login/:logs' do
  param = params[:logs]
  login = JSON.parse(param)
  admin = Admin.where(username: login['username'], password: login['password'])

  if admin.first != nil
    users = admin.map do |user|
      {
        username: user.username,
        password: user.password
      }
      end
    {admin: users}.to_json
  else
    {failed: {}}.to_json
  end
  
end



def check_sanitation_data(school_params)
  (school_params['no_of_girls'] != nil or 
   school_params['no_of_boys'] != nil or 
   school_params['running_water'] != nil or 
   school_params['construction'] != nil or 
   school_params['sanitation_plan'] != nil or
   school_params['total_toilets'] != nil)
end 

post '/uploads' do

  params.each { |param| 
    @filename = params[param[0]][:filename]
    File.open("za_schools/data/raw_data/" + @filename, "w") do |file|
      file.write(params[param[0]][:tempfile].read)
    end
  }

  redirect '/#/admin'

  # This part of code is not being executed - should find out...
  Dir.chdir("za_schools/src/scripts/") do
    system "python za_schools/src/scripts/execute_scripts.py"
  end

end

get '/schools/:name' do
  name = params[:name].upcase
  schools = School.where(name: /.*#{name}.*/)

  schools_data = schools.map do |school|
    matric_result = school.matric_result
    school_sanitation = school.sanitation
  
    {
      emis: school.emis,
      name: school.name,
      type_doe: school.type_doe, 
      lat: school.gis_lat,
      lng: school.gis_lng,
      street_address: school.street_address,
      town: school.town_city,
      province_code: school.province_name,
      pass_rate: matric_result ? matric_result.pass_rate : "",
      passed: matric_result ? matric_result.passed : "",
      wrote: matric_result ? matric_result.wrote : "",
      no_of_boys: school_sanitation ? school_sanitation.no_of_boys : "",
      no_of_girls: school_sanitation ? school_sanitation.no_of_girls : "",
      total_toilets: school_sanitation ? school_sanitation.total_toilets : "",
      sanitation_plan: school_sanitation ? school_sanitation.sanitation_plan : "",
      construction: school_sanitation ? school_sanitation.construction : "",
      running_water: school_sanitation ? school_sanitation.running_water : "",
    }
  end
  {school: schools_data}.to_json
end

get '/sanitations' do
  schools = School.ne(sanitation_emis: "").and.ne(gis_lng: nil)
  sanitation = schools.map do |school|
  school_sanitation = school.sanitation
     {
        name: school.name,
        lat: school.gis_lat,
        lng: school.gis_lng,
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
      name: school.name,
      lat: school.gis_lat,
      lng: school.gis_lng,
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

class Admin
  include Mongoid::Document
  store_in collection: "admin"

  field :username, type: String
  field :password, type: String
  
end


class School
  include Mongoid::Document
  store_in collection: "schools"

  field :emis, type: String
  field :gis_lat, type: String
  field :gis_lng, type: String
  field :name, type: String
  field :province_name, type: String
  field :matric_result_emis, type: String
  field :sanitation_emis, type: String
  field :town_city, type: String
  field :type_doe, type: String
  field :street_address, type: String

  def matric_result
    MatricResult.where(emis: self.matric_result_emis).first
  end

  def sanitation
    Sanitation.where(emis: self.sanitation_emis).first
  end

end

class Province
  include Mongoid::Document
  store_in collection: "provinces"

  field :id, type: Integer
  field :code, type: String
  field :name, type: String
  field :wrote, type: Integer
  field :passed, type: Integer
  field :pass_rate, type: Float
  field :no_of_boys, type: Integer
  field :no_of_girls, type: Integer
  field :total_toilets, type: Integer
  field :running_water, type: Float

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
 store_in collection: "sanitations"

 field :emis, type: String
 field :no_of_boys, type: Integer
 field :no_of_girls, type: Integer
 field :total_toilets, type: Integer
 field :sanitation_plan, type: String
 field :construction, type: String
 field :running_water, type: String

end
