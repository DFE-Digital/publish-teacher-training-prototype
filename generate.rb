#!/usr/bin/env ruby
# Grab courses-clean.json from search-and-compare-data repo
# Run './generate.rb'
require 'json'

file = File.read('courses-clean.json')
data = JSON.parse(file)
provider = 'West London Teaching School Alliance (Secondary)'
courses = data.select {|c| c['provider'] == provider }

prototype_data = {
  'multi-organisation': false,
  'training-provider-name': provider,
  'provider-code': courses.first['providerCode']
}

# Map course data for the `imported from UCAS` view
prototype_data['ucasCourses'] = courses.map do |c|

  options = []

  if !c['qualifications'] || c['qualifications'].length == 0
    qual = "Unknown"
  else
    qual = (c['qualifications'].include?('Postgraduate') || c['qualifications'].include?('Professional')) ? 'PGCE with QTS' : 'QTS'
  end
  partTime = c['campuses'].map {|g| g['partTime'] }.uniq.reject {|r| r == "n/a"}.count > 0
  fullTime = c['campuses'].map {|g| g['fullTime'] }.uniq.reject {|r| r == "n/a"}.count > 0
  salaried = c['route'] == "School Direct training programme (salaried)" ? ' with salary' : ''

  if fullTime && partTime
    options << "#{qual}, full time or part time#{salaried}"
    fullPart = 'Full time or part time'
  elsif partTime
    options << "#{qual} part time#{salaried}"
    fullPart = 'Part time'
  else
    options << "#{qual} full time#{salaried}"
    fullPart = 'Full time'
  end

  schools = c['campuses'].map { |a| { name: a['name'], address: a['address'], code: a['code'] } }

  subjects = c['subjects'].map {|s| s.downcase.capitalize }

  sen = subjects.include?('Special educational needs')
  if subjects.include?('Primary')
    level = 'Primary'
  elsif subjects.include?('Secondary')
    level = 'Secondary'
  else
    level = 'Further education'
  end

  rejectedSubjects = [
    'Primary',
    'Secondary',
    'Further education',
    'Special educational needs',
    'Science'
  ]

  subjectsWithoutLevel = subjects - rejectedSubjects
  if subjectsWithoutLevel.length == 0
    subject = level
  else
    subject = subjects[0]
  end

  type = c['route'] == "School Direct training programme (salaried)" ? 'Salaried' : 'Fee paying (no salary)'
  minRequirements = [
    'Mathematics',
    'English'
  ]

  # TODO: Languages

  prototype_data[c['programmeCode'] + '-outcome'] = qual
  prototype_data[c['programmeCode'] + '-type'] = type
  prototype_data[c['programmeCode'] + '-phase'] = level
  prototype_data[c['programmeCode'] + '-min-requirements'] = minRequirements
  prototype_data[c['programmeCode'] + '-subject'] = subject
  prototype_data[c['programmeCode'] + '-full-part'] = fullPart
  prototype_data[c['programmeCode'] + '-locations'] = schools.map { |s| s[:name] }
  prototype_data[c['programmeCode'] + '-sen'] = 'This is a SEND course' if sen
  prototype_data[c['programmeCode'] + '-has-accredited-provider'] = c['accrediting'] ? 'Yes' : 'No, we are the accredited provider'
  prototype_data[c['programmeCode'] + '-accredited-provider'] = c['accrediting'] || provider
  prototype_data[c['programmeCode'] + '-vacancies-flag'] = 'Yes'
  prototype_data[c['programmeCode'] + '-vacancies-choice'] = 'There are some vacancies'
  prototype_data[c['programmeCode'] + '-full-time-and-part-time'] = partTime && fullTime
  prototype_data[c['programmeCode'] + '-multi-location'] = c['campuses'].length > 1

  c['campuses'].each_with_index do |campus, i|
    prototype_data["#{c['programmeCode']}-vacancies-#{i + 1}"] = 'Vacancies'
  end

  {
    level: level,
    sen: sen,
    accrediting: c['accrediting'] || provider,
    subjects: subjectsWithoutLevel,
    subject: subject,
    outcome: qual,
    type: type,
    name: c['name'],
    route: c['route'],
    providerCode: c['providerCode'],
    programmeCode: c['programmeCode'],
    schools: schools,
    options: options,
    minRequirements: minRequirements,
    'full-part': fullPart
  }
end

prototype_data['ucasCourses'].sort_by! { |k| k[:name] }

# Temporarily empty
# prototype_data['ucasCourses'] = []

# Find all schools across all courses and flatten into array of schools
prototype_data['schools'] = courses.map { |c| c['campuses'].map { |a| { name: a['name'], address: a['address'], code: a['code'] } } }.flatten.uniq
prototype_data['schools'].sort_by! { |k| k[:name] }

# Create a list of accreditors
prototype_data['accreditors'] = courses.uniq {|c| c['accrediting'] }.map  do |c|
  accrediting = c['accrediting']

  if accrediting.nil?
    accrediting = provider
  end

  {
    name: accrediting,
    slug: accrediting.downcase.gsub(/[^a-zA-Z0-9]/, '-').gsub(/--*/, '-').gsub(/-$/,''),
    subjects: []
  }
end

prototype_data['accreditors'].sort_by! { |k| k[:name] }
prototype_data['self_accrediting'] = (prototype_data['accreditors'].length == 1 && prototype_data['accreditors'][0][:name] == provider)

# Create a list of subjects
prototype_data['subjects'] = courses.uniq {|c| c['name'] }.map  do |c|
  {
    name: c['name'],
    slug: c['name'].downcase.gsub(/[^a-zA-Z0-9]/, '-').gsub(/--*/, '-').gsub(/-$/,''),
  }
end

prototype_data['subjects'].sort_by! { |k| k[:name] }

# Group courses by accrediting provider
courses_by_accrediting = {}
prototype_data['accreditors'].each { |c| courses_by_accrediting[c[:name]] = [] }
courses.each do |c|
  courses_by_accrediting[c['accrediting'] || provider] << c
end

# Group courses by subject
courses_by_subject = {}
prototype_data['subjects'].each { |c| courses_by_subject[c[:name]] = [] }
courses.each { |c| courses_by_subject[c['name']] << c }

courses_by_accreditor_and_subject = {}
prototype_data['accreditors'].each do |accrediting|
  courses_by_accreditor_and_subject[accrediting[:name]] = {}
  prototype_data['subjects'].each { |subject| courses_by_accreditor_and_subject[accrediting[:name]][subject[:name]] = [] }
end

courses.each do |course|
  courses_by_accreditor_and_subject[course['accrediting'] || provider][course['name']] << course

  subject = prototype_data['subjects'].find {|s| s[:name] == course['name']}
  prototype_data['accreditors'].find { |a| a[:name] == (course['accrediting'] || provider)}[:subjects] << subject
end

prototype_data['new-course'] = {
  'include-accredited': courses.first['route'].include?('School Direct'),
  'include-fee-or-salary': courses.first['route'].include?('School Direct'),
  'include-locations': prototype_data['schools'].length > 1
}

prototype_data['accreditors'].each {|a| a[:subjects].sort_by! { |k| k[:name] }.uniq! }

# Output to prototype
File.open('lib/prototype_data.json', 'w') { |file| file.write(JSON.pretty_generate(prototype_data) + "\n") }
