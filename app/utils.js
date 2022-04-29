const request = require('request')

function generateCourseCode () {
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ'.split('')
  const letter = letters[Math.floor(Math.random() * letters.length)]
  const code = letter + Math.floor(Math.random() * (999 - 100 + 1) + 100)
  return code
}

function generateLocationCode (exclude = []) {
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ0123456789'.split('').filter((l) => !exclude.includes(l))
  return letters[Math.floor(Math.random() * letters.length)]
}

function getGeneratedTitle (code, data) {
  let generatedTitle = data[code + '-subject']

  if (isFurtherEducation(code, data)) {
    generatedTitle = 'Further education'
    data[code + '-generated-title'] = generatedTitle

    return generatedTitle
  }

  if (data[code + '-second-subject']) {
    generatedTitle = `${generatedTitle} with ${data[code + '-second-subject']}`
  }

  if (data[code + '-age-youngest']) {
    generatedTitle = `${generatedTitle} (${data[code + '-age-youngest']} – ${data[code + '-age-oldest']})`
  }

  if (isModernLanguages(code, data)) {
    const languages = data[code + '-languages'] || []
    if (languages.length === 1 || languages.length === 3) {
      generatedTitle = `${generatedTitle} (${languages.join(', ')})`
    } else if (languages.length === 2) {
      generatedTitle = `${generatedTitle} (${languages[0]} and ${languages[1]})`
    }
  }

  if (data[code + '-sen']) {
    generatedTitle = generatedTitle + ' (with Special educational needs and disability)'
  }

  data[code + '-generated-title'] = generatedTitle
  return generatedTitle
}

function originalQuery (req) {
  const originalQueryString = req.originalUrl.split('?')[1]
  return originalQueryString ? `?${originalQueryString}` : ''
}

function includeLocationsInWizard (data) {
  return data.schools.length > 1
}

function nextAndBackPaths (paths, currentPath, query, isModernLanguages = false) {
  const index = paths.indexOf(currentPath)
  const next = paths[index + 1] || ''
  let back = paths[index - 1] || ''

  if (back && back.includes('languages') && !isModernLanguages) {
    back = paths[index - 2]
  }

  return {
    next: /confirm|edit/.test(next) ? next : next + query,
    back: /confirm|edit/.test(back) ? back : back + query,
    current: /confirm|edit/.test(back) ? currentPath : currentPath + query
  }
}

function onboardingWizardPaths (req) {
  const paths = [
    '/onboarding/accept-terms',
    '/onboarding/name',
    '/onboarding/code',
    '/onboarding/contact',
    '/onboarding/location',
    '/onboarding/request-access',
    '/onboarding/apply-settings',
    '/onboarding/gt12',
    '/onboarding/alerts',
    '/onboarding/ucas-contacts',
    '/'
  ]

  return nextAndBackPaths(paths, req.path, originalQuery(req))
}

function newFurtherEducationCourseWizardPaths (req) {
  const { code, flow } = req.params
  const data = req.session.data
  const editing = flow === 'edit'
  const summaryView = editing ? 'edit' : 'confirm'

  if (req.query.change && req.query.change !== 'phase') {
    return {
      next: `/${flow}/${code}/further/${summaryView}`,
      back: `/${flow}/${code}/further/${summaryView}`
    }
  }

  const paths = [
    '/courses',
    `/${flow}/${code}/phase`,
    `/${flow}/${code}/further/outcome`,
    `/${flow}/${code}/further/full-time-part-time`,
    `/${flow}/${code}/further/title`,
    ...(includeLocationsInWizard(data) ? [`/${flow}/${code}/further/training-locations`] : []),
    `/${flow}/${code}/further/applications-open`,
    `/${flow}/${code}/further/start-date`,
    `/${flow}/${code}/further/${summaryView}`,
    `/${flow}/${code}/further/create`
  ]

  const nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req))

  if (nextAndBack.back === '/courses?change=phase') {
    nextAndBack.back = `/new/${code}/further/${summaryView}`
  }

  return nextAndBack
}

function newCourseWizardPaths (req) {
  const data = req.session.data
  const { code, flow } = req.params
  const editing = flow === 'edit'
  const returnPath = editing ? `/course/${data['provider-code']}/${code}?edited=true#information` : `/new/${code}/confirm`

  if (isFurtherEducation(code, data)) {
    return newFurtherEducationCourseWizardPaths(req)
  }

  if (req.query.change === 'subject') {
    return editSubjectPaths(req, returnPath)
  }

  if (req.query.change === 'languages') {
    return editLanguagePaths(req, returnPath)
  }

  if (editing) {
    return {
      next: returnPath,
      back: returnPath
    }
  }

  const paths = [
    '/courses',
    `/${flow}/${code}/phase`,
    `/${flow}/${code}/subject`,
    `/${flow}/${code}/languages`,
    `/${flow}/${code}/age-range`,
    `/${flow}/${code}/outcome`,
    ...(data['new-course']['include-fee-or-salary'] ? [`/${flow}/${code}/funding`] : [`/${flow}/${code}/apprenticeship`]),
    `/${flow}/${code}/full-time-part-time`,
    ...(data['new-course']['include-accredited'] ? [`/${flow}/${code}/accredited-body`] : []),
    `/${flow}/${code}/placement-locations`,
    `/${flow}/${code}/training-locations`,
    `/${flow}/${code}/applications-open`,
    `/${flow}/${code}/start-date`,
    `/${flow}/${code}/confirm`,
    `/${flow}/${code}/create`
  ]

  const nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data))

  return nextAndBack
}

function placementsWizardPaths (req) {
  const { data } = req.session
  const { referrer } = req.query

  const schoolLocations = data.schools.filter(school => school.type.includes('school'))

  const paths = [
    ...(referrer || ['/locations']),
    '/locations',
    '/locations/placements-display',
    '/locations/placements-policy',
    ...(schoolLocations.length === 0 ? ['/locations/add'] : ['/locations']),
    '/locations/add-answer'
  ]

  const nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req))

  return nextAndBack
}

function editSubjectPaths (req, summaryView = 'confirm') {
  const data = req.session.data
  const code = req.params.code
  const paths = [
    `/new/${code}/${summaryView}`,
    `/new/${code}/subject`,
    `/new/${code}/languages`,
    `/new/${code}/age-range`,
    `/new/${code}/${summaryView}`
  ]

  return nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data))
}

function editLanguagePaths (req, summaryView = 'confirm') {
  const data = req.session.data
  const code = req.params.code
  const paths = [
    `/new/${code}/${summaryView}`,
    `/new/${code}/languages`,
    `/new/${code}/${summaryView}`
  ]

  return nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data))
}

function newLocationWizardPaths (req) {
  const code = req.params.code
  const data = req.session.data
  const editing = data.schools.some(a => a.code === code)
  const summaryView = editing ? 'edit' : 'confirm'

  if (isRegionLocation(code, data)) {
    return newRegionLocationWizardPaths(req)
  }

  if (req.query.change === 'pick-location') {
    return editPickedLocationPaths(req, summaryView)
  }

  if (req.query.change && req.query.change !== 'type') {
    return {
      next: `/new-location/${code}/${summaryView}`,
      back: `/new-location/${code}/${summaryView}`
    }
  }

  const paths = [
    '/locations',
    `/new-location/${code}/type`,
    `/new-location/${code}/pick-location`,
    `/new-location/${code}/address`,
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/create`
  ]

  const nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req))

  if (nextAndBack.back === '/locations?change=type') {
    nextAndBack.back = `/new-location/${code}/${summaryView}`
  }

  return nextAndBack
}

function newRegionLocationWizardPaths (req) {
  const code = req.params.code
  const data = req.session.data
  const editing = data.schools.some(a => a.code === code)
  const summaryView = editing ? 'edit' : 'confirm'

  if (req.query.change && req.query.change !== 'type') {
    return {
      next: `/new-location/${code}/${summaryView}`,
      back: `/new-location/${code}/${summaryView}`
    }
  }

  const paths = [
    '/locations',
    `/new-location/${code}/type`,
    `/new-location/${code}/region-name`,
    `/new-location/${code}/region-schools`,
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/create`
  ]

  const nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req))

  if (nextAndBack.back === '/locations?change=type') {
    nextAndBack.back = `/new-location/${code}/${summaryView}`
  }

  return nextAndBack
}

function editPickedLocationPaths (req, summaryView = 'confirm') {
  const { code } = req.params
  const paths = [
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/pick-location`,
    `/new-location/${code}/address`,
    `/new-location/${code}/${summaryView}`
  ]

  return nextAndBackPaths(paths, req.path, originalQuery(req))
}

function getCourseOffered (code, data) {
  let courseOffered = data[code + '-outcome'] || ''

  if (courseOffered.includes('PGCE only')) {
    courseOffered = 'PGCE'
  }

  if (courseOffered.includes('PGDE only')) {
    courseOffered = 'PGDE'
  }

  if (data[code + '-full-part'] === 'Full time or part time') {
    courseOffered = courseOffered + ', full time or part time'
  } else if (data[code + '-full-part']) {
    courseOffered = courseOffered + ' ' + data[code + '-full-part'].toLowerCase()
  }

  if (data[code + '-type'] === 'Salaried') {
    courseOffered = courseOffered + ' with salary'
  }

  if (data[code + '-type'] === 'Teaching apprenticeship' || data[code + '-apprenticeship'] === 'Yes') {
    courseOffered = courseOffered + ' teaching apprenticeship'
  }

  data[code + '-generated-description'] = courseOffered
  return courseOffered
}

function getLocations (code, data, callback) {
  const promises = []
  let choices = data[code + '-area-schools']
  if (!Array.isArray(choices)) {
    choices = [choices]
  }

  choices.forEach(function (choice) {
    const p = new Promise(function (resolve, reject) {
      getLocationFromChoice(data, choice, function (location, urn) {
        resolve(location)
      })
    })
    promises.push(p)
  })

  Promise.all(promises).then(function (values) {
    callback(values)
  })
}

function getLocationFromChoice (data, choice, callback) {
  const parts = choice.split(' (')
  const urn = parts[1].split(',')[0]
  requestLocation(data, urn, callback)
}

function requestLocation (data, urn, callback) {
  if (data[urn]) {
    callback(data[urn])
    return
  }

  request({
    url: `https://raw.githubusercontent.com/fofr/schools-json/master/schools/${urn}.json`,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const location = body

      if (location.url && !location.url.startsWith('http')) {
        location.url = `http://${location.url}`
      }

      data[urn] = location
      callback(location, urn)
    }
  })
}

function isModernLanguages (code, data) {
  return data[code + '-subject'] === 'Modern languages'
}

function isRegionLocation (code, data) {
  return data[code + '-location-type'] && data[code + '-location-type'].includes('A region or area')
}

function isFurtherEducation (code, data) {
  return data[code + '-phase'] === 'Further education'
}

function subject (req) {
  const accrediting = accreditor(req)
  const subject = accrediting.subjects.find(function (s) {
    return s.slug === req.params.subject
  })

  return {
    name: subject.name,
    slug: subject.slug
  }
}

function course (req) {
  const course = req.session.data.ucasCourses.find(function (a) {
    return a.programmeCode === req.params.code
  })

  course.path = `/course/${course.providerCode}/${course.programmeCode}`
  course.salaried = (course.route === 'School Direct training programme (salaried)')
  return course
}

function provider (req) {
  const provider = req.session.data.providers.find(function (a) {
    return a.code === req.params.code
  })

  return provider
}

function validate (data, course, view) {
  const prefix = course.programmeCode
  const errors = []
  view = view || 'all'

  if (view === 'all' || view === 'about-this-course') {
    if (!data[prefix + '-about-this-course']) {
      errors.push({
        title: 'Enter details about this course',
        id: `${prefix}-about-this-course`,
        link: `/about-this-course#${prefix}-about-this-course`,
        page: 'about-this-course'
      })
    }
  }

  if (view === 'all') {
    if (!data[prefix + '-degree-minimum-required']) {
      errors.push({
        title: 'Do you require a minimum degree classification?',
        id: `${prefix}-degree-minimum-required`,
        link: '/degree'
      })
    }
  }

  if (view === 'all') {
    if (!data[prefix + '-pending-gcses']) {
      errors.push({
        title: 'GCSEs and equivalency tests',
        id: `${prefix}-gcse-english-flexibility`,
        link: '/gcses-pending-or-equivalency-tests'
      })
    }
  }

  if (view === 'all') {
    if (!data[prefix + '-training-locations']) {
      errors.push({
        title: 'Where will candidates do their centre-based training?',
        id: `${prefix}-training-locations`,
        href: `/edit/${prefix}/training-locations`
      })
    }
  }

  if (view === 'all' || view === 'fees-and-length') {
    if (!data[prefix + '-duration']) {
      errors.push({
        title: 'Enter a course length',
        id: `${prefix}-duration`,
        link: `/fees-and-length#${prefix}-duration`,
        page: 'fees-and-length'
      })
    }

    if (!course.salaried && !data[prefix + '-fee']) {
      errors.push({
        title: 'Enter course fees for UK and EU students',
        id: `${prefix}-fee`,
        link: `/fees-and-length#${prefix}-fee`,
        page: 'fees-and-length'
      })
    }

    if (course.salaried && !data[prefix + '-salary-details']) {
      errors.push({
        title: 'Give details about the salary for this course',
        id: `${prefix}-salary-details`,
        link: `/fees-and-length#${prefix}-salary-details`,
        page: 'fees-and-length'
      })
    }
  }

  return errors.map(e => {
    e.text = e.title
    e.href = e.href || course.path + e.link

    return e
  })
}

function validateOrg (data, view) {
  const errors = []
  view = view || 'all'

  if (view === 'all' || view === 'about-your-organisation') {
    if (!data['about-organisation']) {
      errors.push({
        title: 'Give details about your organisation',
        id: 'about-organisation',
        link: '/about-your-organisation/edit#about-organisation',
        page: 'about-your-organisation'
      })
    }

    if (!data['training-with-a-disability']) {
      errors.push({
        title: 'Give details about training with a disability',
        id: 'training-with-a-disability',
        link: '/about-your-organisation/edit#training-with-a-disability',
        page: 'about-your-organisation'
      })
    }
  }

  if (!data.canSponsorStudentVisa) {
    errors.push({
      title: 'Select if you can sponsor visas',
      id: 'visa-sponsorship',
      link: '/about-your-organisation/visa-sponsorship',
      page: 'about-your-organisation'
    })
  }

  if (view === 'all' || view === 'contact-details') {
    if (!data.email) {
      errors.push({
        title: 'Email address is missing',
        id: 'email',
        link: '/about-your-organisation/contact#email',
        page: 'contact'
      })
    }

    if (!data.telephone) {
      errors.push({
        title: 'Telephone number is missing',
        id: 'telephone',
        link: '/about-your-organisation/contact#telephone',
        page: 'contact'
      })
    }

    if (!data.website) {
      errors.push({
        title: 'Website is missing',
        id: 'website',
        link: '/about-your-organisation/contact#website',
        page: 'contact'
      })
    }

    if (!data['building-and-street']) {
      errors.push({
        title: 'Give a building and street name in your contact address',
        id: 'building-and-street',
        link: '/about-your-organisation/contact#building-and-street',
        page: 'contact'
      })
    }

    if (!data['town-or-city']) {
      errors.push({
        title: 'Give a town or city in your contact address',
        id: 'town-or-city',
        link: '/about-your-organisation/contact#town-or-city',
        page: 'contact'
      })
    }

    if (!data.postcode) {
      errors.push({
        title: 'Give a postcode in your contact address',
        id: 'postcode',
        link: '/about-your-organisation/contact#postcode',
        page: 'contact'
      })
    }

    if (!data.county) {
      errors.push({
        title: 'Give a county in your contact address',
        id: 'county',
        link: '/about-your-organisation/contact#county',
        page: 'contact'
      })
    }
  }

  return errors.map(e => {
    e.text = e.title
    e.href = e.link

    return e
  })
}

module.exports = {
  generateCourseCode,
  generateLocationCode,
  getGeneratedTitle,
  getCourseOffered,
  getLocationFromChoice,
  getLocations,
  isModernLanguages,
  isFurtherEducation,
  isRegionLocation,
  onboardingWizardPaths,
  placementsWizardPaths,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  newLocationWizardPaths,
  subject,
  course,
  provider,
  validate,
  validateOrg
}
