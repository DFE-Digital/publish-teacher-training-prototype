courses = data.select {|c| c['provider'] == 'West London Teaching School Alliance (Secondary)' }
courses_mapped = courses.map do |c|
  {
    regions: c['regions'].join(', '),
    accrediting: c['accrediting'],
    subjects: c['subjects'].map {|s| s.downcase.capitalize }.join(', '),
    ageRange: c['ageRange'].capitalize,
    name: c['name'],
    route: c['route'],
    qualifications: c['qualifications'].join(', '),
    providerCode: c['providerCode'],
    programmeCode: c['programmeCode'],
    schools: c['campuses'].map { |a| { name: a['name'], address: a['address'], code: a['code'] } }
  }
end

puts JSON.pretty_generate(courses_mapped)

subjects = courses.uniq {|c| c['name'] }.map {|c| c['name'] }
courses_by_subject = {}
subjects.each { |c| courses_by_subject[c] = [] }
courses.each { |c| courses_by_subject[c['name']] << c }

folded_courses = []
courses_by_subject.to_a.each do |s|
  subject = s[0]
  subject_courses = s[1]
  options = []

  subject_courses.each do |sc|
    qual = sc['qualifications'].include?('Postgraduate') ? 'PGCE with QTS' : 'QTS'
    partTime = sc['campuses'].map {|g| g['partTime'] }.uniq.reject {|r| r == "n/a"}.count > 0
    fullTime = sc['campuses'].map {|g| g['fullTime'] }.uniq.reject {|r| r == "n/a"}.count > 0
    salaried = sc['route'] == "School Direct training programme (salaried)" ? ' with salary' : ''

    if partTime
      options << "#{qual}, 1 year part time#{salaried}"
    end

    if fullTime
      options << "#{qual}, 1 year full time#{salaried}"
    end
  end

  puts options

  folded_course = {
   name: subject,
   courses: subject_courses.count,
   accrediting: subject_courses.map {|c| c['accrediting']}.uniq.join(', '),
   applicationsOpen: subject_courses.map {|c| c['campuses'].map {|g| g['applyFrom'] }}.flatten.uniq.reject {|r| r == "n/a"},
   schoolsWithVacancies: subject_courses.map {|c| c['campuses'].map {|g| g['name'] }}.flatten.uniq,
   options: options,
   flags: {
     partTime: subject_courses.map {|c| c['campuses'].map {|g| g['partTime'] }}.flatten.uniq.reject {|r| r == "n/a"}.count > 1,
     salary: subject_courses.map {|c| c['route'] }.flatten.uniq.include?("School Direct training programme (salaried)"),
     qualifications: subject_courses.map {|c| c['qualifications'] }.uniq.count > 1
   }
  }

  folded_courses << folded_course
end; nil

puts JSON.pretty_generate(folded_courses)
