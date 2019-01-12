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

def course_qualification(c)
  if !c['qualifications'] || c['qualifications'].length == 0
    qual = "Unknown"
  else
    qual = (c['qualifications'].include?('Postgraduate') || c['qualifications'].include?('Professional')) ? 'PGCE with QTS' : 'QTS'
  end

  qual
end

# Map course data for the `imported from UCAS` view
prototype_data['ucasCourses'] = courses.each_with_index.map do |c, idx|
  options = []
  courseCode = c['programmeCode']
  lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  if idx < 6
    prototype_data[courseCode + '-about-this-course'] = lorem
    prototype_data[courseCode + '-interview-process'] = lorem
    prototype_data[courseCode + '-placement-school-policy'] = lorem
    prototype_data[courseCode + '-duration'] = '1 year'
    prototype_data[courseCode + '-salary-details'] = lorem
    prototype_data[courseCode + '-fee'] = '9,000'
    prototype_data[courseCode + '-fee-international'] = '14,000'
    prototype_data[courseCode + '-fee-details'] = lorem
    prototype_data[courseCode + '-financial-support'] = lorem
    prototype_data[courseCode + '-qualifications-required'] = lorem
    prototype_data[courseCode + '-personal-qualities'] = lorem
    prototype_data[courseCode + '-other-requirements'] = lorem
  end

  if idx == 0 || idx == 4 || idx == 5
    prototype_data[courseCode + '-publish-state'] = 'published'
    prototype_data[courseCode + '-published-before'] = true
  end

  if idx == 1 || idx == 2
    prototype_data[courseCode + '-publish-state'] = 'draft'
    prototype_data[courseCode + '-published-before'] = false
  end

  if idx == 3
    prototype_data[courseCode + '-fee'] = '10,000'
    prototype_data[courseCode + '-publish-state'] = 'published-with-changes'
    prototype_data[courseCode + '-published-before'] = true
  end

  qual = course_qualification(c)

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

  prototype_data[courseCode + '-generated-title'] = c['name']
  prototype_data[courseCode + '-outcome'] = qual
  prototype_data[courseCode + '-type'] = type
  prototype_data[courseCode + '-phase'] = level
  prototype_data[courseCode + '-min-requirements'] = minRequirements
  prototype_data[courseCode + '-subject'] = subject
  prototype_data[courseCode + '-full-part'] = fullPart
  prototype_data[courseCode + '-locations'] = schools.map { |s| s[:name] }
  prototype_data[courseCode + '-sen'] = 'This is a SEND course' if sen
  prototype_data[courseCode + '-has-accredited-body'] = c['accrediting'] ? 'Yes' : 'No, we are the accredited body'
  prototype_data[courseCode + '-accredited-body'] = c['accrediting'] || provider
  prototype_data[courseCode + '-vacancies-flag'] = idx == 4 ? 'No' : 'Yes'
  prototype_data[courseCode + '-vacancies-choice'] = idx == 4 ? 'There are no vacancies' : 'There are some vacancies'
  prototype_data[courseCode + '-full-time-and-part-time'] = partTime && fullTime
  prototype_data[courseCode + '-multi-location'] = c['campuses'].length > 1

  c['campuses'].each_with_index do |campus, i|
    prototype_data["#{courseCode}-vacancies-#{i + 1}"] = 'Vacancies'
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
    programmeCode: courseCode,
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
