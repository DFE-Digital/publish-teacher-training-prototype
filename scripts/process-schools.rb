#!/usr/bin/env ruby
# Run './process-schools.rb'
require 'csv'

class UpdateSchoolData
  def run
    save_csv_file
    schools = []

    puts csv_file_location

    CSV.foreach(csv_file_location, headers: true, encoding: 'windows-1251:utf-8').each do |row|
      # puts row if row.to_s.downcase.include?('cardiff')
      # puts row['DistrictAdministrative (name)']
      # puts row if row['country']
      next if row['EstablishmentStatus (name)'].eql?('Closed')
      school = convert_to_school(row)
      schools << school
    end

    autocomplete_strings =  schools.map do |s|
                              "#{s['name']} (#{s['urn']}, #{s['town']}, #{s['postcode']})"
                            end

    # puts autocomplete_strings[0]
    # puts autocomplete_strings.uniq.count
    File.open('app/assets/javascripts/schools.js', 'w') { |file| file.write("var autocomplete_options = " + autocomplete_strings.uniq.inspect + ";") }
  end

  private

  def convert_to_school(row)
    school = {}
    set_properties(school, row)
    school
  end

  def set_properties(school, row)
    school['urn'] = row['URN']
    school['name'] = row['EstablishmentName']
    school['address'] = row['Street']
    school['locality'] = row['Locality']
    school['address3'] = row['Address3']
    school['town'] = row['Town']
    school['county'] = row['County (name)']
    school['postcode'] = row['Postcode']
    school['minimum_age'] = row['StatutoryLowAge']
    school['maximum_age'] = row['StatutoryHighAge']
    school['easting'] = row['Easting']
    school['northing'] = row['Northing']
    school['url'] = row['SchoolWebsite']
    school['phase'] = row['PhaseOfEducation (name)']
    school['type'] = row['EstablishmentTypeGroup (name)']
    school['detailed_type'] = row['TypeOfEstablishment (name)']
  end

  def datestring
    Time.now.strftime('%Y%m%d')
  end

  def csv_file_location
    "edubasealldata#{datestring}.csv"
  end

  def save_csv_file(location: csv_file_location)
    # File.open(location, 'wb') do |f|
    #   request = HTTParty.get(csv_url)
    #
    #   if request.code == 200
    #     f.write request.body
    #   elsif request.code == 404
    #     raise HTTParty::ResponseError, 'School CSV file not found.'
    #   else
    #     raise HTTParty::ResponseError, 'Unexpected problem downloading School CSV file.'
    #   end
    # end
  end

  def csv_url
    "http://ea-edubase-api-prod.azurewebsites.net/edubase/edubasealldata#{datestring}.csv"
  end

  # def valid_website(url)
  #   Addressable::URI.heuristic_parse(url).to_s
  # end
end

u = UpdateSchoolData.new
u.run
