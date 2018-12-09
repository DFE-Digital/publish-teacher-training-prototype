#!/usr/bin/env ruby
# Grab courses-clean.json from search-and-compare-data repo
# Run './generate.rb'
require 'json'

file = File.read('courses-clean.json')
data = JSON.parse(file)
provider = 'University of Wolverhampton'
courses = data.select {|c| c['provider'] == provider }

prototype_data = {
  'multi-organisation': false,
  'training-provider-name': provider,
  'provider-code-name': courses.first['providerCodeName'],
  'provider-code': courses.first['providerCode'],
  # "25PP-about-this-course": "About this course",
  # "25PP-interview-process": "Interview process",
  # "25PP-placement-school-policy": "How school placements work",
  # "25PP-duration": "1 year",
  # "25PP-fee": "1,000",
  # "25PP-fee-international": "5,000",
  # "25PP-fee-details": "Fee details",
  # "25PP-financial-support": "Financial support you offer",
  # "25PP-qualifications-required": "Qualifications required",
  # "25PP-personal-qualities": "Personal qualities",
  # "25PP-other-requirements": "Other requirements",
  #
  # "2926-about-this-course": "About this course",
  # "2926-placement-school-policy": "How school placements work",
  # "2926-duration": "1 year",
  # "2926-fee": "1,000",
  # "2926-qualifications-required": "Qualifications required",
  #
  # "25MG-about-this-course": "About this course",
  # "25MG-interview-process": "Interview process",
  # "25MG-placement-school-policy": "How school placements work",
  # "25MG-duration": "1 year",
  # "25MG-salary-details": "Salary",
  # "25MG-qualifications-required": "Qualifications required",
  # "25MG-personal-qualities": "Personal qualities",
  # "25MG-other-requirements": "Other requirements",
  #
  # "25MP-about-this-course": "About this course",
  # "25MP-placement-school-policy": "How school placements work",
  # "25MP-duration": "1 year",
  # "25MP-salary-details": "Salary",
  # "25MP-qualifications-required": "Qualifications required",
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

  if partTime
    options << "#{qual} part time#{salaried}"
  end

  if fullTime
    options << "#{qual} full time#{salaried}"
  end

  prototype_data[c['programmeCode'] + '-outcome'] = qual
  prototype_data[c['programmeCode'] + '-accredited-provider'] = c['accrediting'] || provider

  {
    regions: c['regions'].join(', '),
    accrediting: c['accrediting'] || provider,
    subjects: c['subjects'].map {|s| s.downcase.capitalize }.join(', '),
    ageRange: c['ageRange'].capitalize,
    name: c['name'],
    slug: c['name'].downcase.gsub(/[^a-zA-Z0-9]/, '-').gsub(/--*/, '-').gsub(/-$/,''),
    route: c['route'],
    qualifications: c['qualifications'] ? c['qualifications'].join(', ') : 'Unknown',
    providerCode: c['providerCode'],
    programmeCode: c['programmeCode'],
    schools: c['campuses'].map { |a| { name: a['name'], address: a['address'], code: a['code'] } },
    options: options
  }
end

prototype_data['ucasCourses'].sort_by! { |k| k[:name] }

# Temporarily empty
prototype_data['ucasCourses'] = []

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
