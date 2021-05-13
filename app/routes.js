const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
const {
  generateCourseCode,
  generateLocationCode,
  getGeneratedTitle,
  getCourseOffered,
  getLocationFromChoice,
  getLocations,
  isModernLanguages,
  isFurtherEducation,
  isRegionLocation,
  isUsingPlacementLocations,
  onboardingWizardPaths,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  newLocationWizardPaths,
  course,
  provider,
  validate,
  validateOrg
} = require('./utils')

// Route index page
router.all('/', function (req, res) {
  if (req.session.data['multi-organisation']) {
    res.render('organisations/index')
  } else {
    res.render('organisation/index', { nextCycle: true, currentCycle: false })
  }
})

router.all('/next-cycle', function (req, res) {
  res.render('organisation/index', { nextCycle: true, currentCycle: false })
})

router.all('/current-cycle', function (req, res) {
  res.render('organisation/index', { nextCycle: false, currentCycle: true })
})

router.all('/courses', function (req, res) {
  res.render('courses/index', {
    justEditedVacancies: req.query.editedVacancies,
    justDeleted: req.query.deleted
  })
})

router.get('/new/start', function (req, res) {
  const code = generateCourseCode()
  const data = req.session.data

  if (data.schools.length === 1) {
    data[code + '-locations'] = [data.schools[0].name]
  }

  res.redirect('/new/' + code + '/phase')
})

router.all('/cycles', function (req, res) {
  res.render('cycles', { justRolledOver: req.query.rolled })
})

router.all(['/new/:code/placement-locations', '/new/:code/further/placement-locations'], function (req, res) {
  const data = req.session.data
  const code = req.params.code
  const locations = data[`${code}-locations`] || []
  const items = []

  data.schools.forEach(school => {
    if (school.code !== '-') {
      items.push({
        value: school.name,
        text: school.name,
        checked: locations.includes(school.name),
        label: {
          classes: 'govuk-label--s'
        },
        hint: {
          text: school.address
        }
      })
    }
  })

  if (isUsingPlacementLocations(code, data)) {
    res.render('new/placement-locations', {
      code,
      paths: newCourseWizardPaths(req),
      items
    })
  } else {
    res.redirect('/new/' + code + '/training-location')
  }
})

router.all(['/new/:code/training-location'], function (req, res) {
  const data = req.session.data
  const code = req.params.code
  const locations = data[`${code}-training-location`] || []
  const items = []

  data.schools.forEach(school => {
    if (school.code === '-') {
      items.push({
        value: school.name + ', ' + 'Leeds',
        text: school.name,
        checked: locations.includes(school.name),
        label: {
          classes: 'govuk-label--s'
        },
        hint: {
          text: school.address
        }
      })
    }
  })

  res.render('new/training-location', {
    code,
    paths: newCourseWizardPaths(req),
    items
  })
})

router.all(['/new/:code/title', '/new/:code/further/title'], function (req, res) {
  const data = req.session.data
  const code = req.params.code

  res.render('new/title', {
    code,
    paths: newCourseWizardPaths(req),
    generatedTitle: getGeneratedTitle(code, data),
    courseOffered: getCourseOffered(code, data)
  })
})

router.all(['/new/:code/editing-title', '/new/:code/further/editing-title'], function (req, res) {
  const data = req.session.data
  const code = req.params.code

  res.render('new/editing-title', {
    code,
    paths: newCourseWizardPaths(req),
    generatedTitle: getGeneratedTitle(code, data),
    courseOffered: getCourseOffered(code, data)
  })
})

router.all(['/new/:code/confirm', '/new/:code/further/confirm'], function (req, res) {
  const data = req.session.data
  const code = req.params.code

  res.render('new/confirm', {
    code,
    paths: newCourseWizardPaths(req),
    courseOffered: getCourseOffered(code, data)
  })
})

router.post('/new/:code/subject', function (req, res) {
  const code = req.params.code
  const data = req.session.data

  if (isFurtherEducation(code, data)) {
    res.redirect('/new/' + code + '/further/outcome')
  } else {
    res.render('new/subject', {
      code,
      paths: newCourseWizardPaths(req)
    })
  }
})

router.post('/new/:code/languages', function (req, res) {
  const code = req.params.code
  const data = req.session.data
  const paths = newCourseWizardPaths(req)

  if (isModernLanguages(code, data)) {
    res.render('new/languages', {
      code,
      paths: paths
    })
  } else {
    res.redirect(paths.next)
  }
})

// Take new data and make it into a course
router.all(['/new/:code/create', '/new/:code/further/create'], function (req, res) {
  const data = req.session.data
  const code = req.params.code
  const languages = []

  if (data[code + '-first-language']) {
    languages.push(data[code + '-first-language'])
  }

  if (data[code + '-second-language']) {
    languages.push(data[code + '-second-language'])
  }

  const schools = []
  if (Array.isArray(data[code + '-locations'])) {
    data[code + '-locations'].forEach(name => {
      schools.push(data.schools.find(school => school.name === name))
    })
  }

  if (schools.length === 0) {
    schools.push(data.schools[0])
  }

  data[code + '-multi-location'] = schools.length > 1

  // TODO:
  // If training location added – it'll affect vacancies

  let course = data.ucasCourses.find(a => a.programmeCode === code)
  let editing = true
  let publishedBefore = false

  if (!course) {
    course = {}
    data.ucasCourses.unshift(course)
    editing = false
  } else if (data[code + '-published-before']) {
    publishedBefore = true
  }

  course.name = data[code + '-generated-title']
  if (data[code + '-change-title'] === 'Yes, that’s correct') {
    course.titleRequested = false
  } else {
    course.titleRequested = data[code + '-title']
  }

  course.accrediting = data[code + '-accredited-body'] || data['training-provider-name']
  course.level = data[code + '-phase']
  course.sen = data[code + '-sen']
  course.subject = data[code + '-subject']
  course.secondSubject = data[code + '-second-subject']
  course.languages = languages
  course['full-part'] = data[code + '-full-part']
  course.type = data[code + '-type']
  course.outcome = data[code + '-outcome']
  course.providerCode = data['provider-code']
  course.programmeCode = code
  course.schools = schools
  course.starts = data[code + '-start-date']
  course.minRequirements = data[code + '-min-requirements']
  course.options = [
    data[code + '-generated-description']
  ]

  let query = ''
  if (publishedBefore) {
    query = 'editedAndPublished=true'
  } else if (editing) {
    query = 'edited=true'
  } else {
    query = 'created=true'
  }

  res.redirect(`/course/${data['provider-code']}/${code}?${query}`)
})

router.get('/new/:code/accredited-body', function (req, res) {
  const code = req.params.code
  const data = req.session.data

  const accreditedBodies = data['accredited-bodies-choices'].map(body => ({
    value: body.name,
    text: body.name
  }))

  accreditedBodies.unshift({
    value: '',
    text: ''
  })

  const accreditors = data.accreditors.slice().map(body => ({
    value: body.name,
    text: body.name
  }))

  res.render('new/accredited-body', {
    code,
    paths: newCourseWizardPaths(req),
    accreditedBodies,
    accreditors
  })
})

router.all('/new/:code/:view', function (req, res) {
  const code = req.params.code

  res.render(`new/${req.params.view}`, {
    code,
    paths: newCourseWizardPaths(req)
  })
})

router.all('/new/:code/further/:view', function (req, res) {
  const code = req.params.code
  const locals = {
    code,
    paths: newFurtherEducationCourseWizardPaths(req)
  }

  // Render the non-specific FE view
  res.render(`new/further/${req.params.view}`, locals, function (err, html) {
    if (err) {
      if (err.message.indexOf('template not found') !== -1) {
        return res.render(`new/${req.params.view}`, locals)
      }
      throw err
    }
    res.send(html)
  })
})

router.get('/new-location/start', function (req, res) {
  const existingCodes = req.session.data.schools.map(s => s.code)
  const code = generateLocationCode(existingCodes)
  res.redirect('/new-location/' + code + '/type')
})

router.post('/new-location/:code/type', function (req, res) {
  const paths = newLocationWizardPaths(req)
  res.redirect(paths.next)
})

router.all('/new-location/:code/address', function (req, res) {
  const data = req.session.data
  const code = req.params.code

  getLocationFromChoice(data, data[code + '-location-picked'], function (location, urn) {
    data[code + '-location'] = location
    data[code + '-urn'] = urn

    res.render('new-location/address', {
      code,
      paths: newLocationWizardPaths(req),
      location: location
    })
  })
})

router.all('/new-location/:code/confirm', function (req, res) {
  const data = req.session.data
  const code = req.params.code

  getLocations(code, data, function (locations) {
    res.render('new-location/confirm', {
      code,
      paths: newLocationWizardPaths(req),
      locations: locations
    })
  })
})

router.all('/new-location/:code/edit', function (req, res) {
  const code = req.params.code

  res.render('new-location/edit', {
    code,
    paths: newLocationWizardPaths(req)
  })
})

// Take new data and make it into a location
router.all('/new-location/:code/create', function (req, res) {
  const data = req.session.data
  const code = req.params.code

  let loc = data.schools.find(a => a.code === code)
  if (!loc) {
    loc = {}
    data.schools.push(loc)
  }

  loc.type = data[code + '-location-type']
  loc.urn = data[code + '-urn']
  loc.code = code

  if (isRegionLocation(code, data)) {
    loc.name = data[code + '-region-name']
    loc.address = `${data[code + '-address']}, ${data[code + '-town']}, ${data[code + '-postcode']}`
    loc.schools = data[code + '-area-school-names']
    loc.pickedSchools = data[code + '-area-schools']
  } else {
    loc.name = data[code + '-name']
    loc.address = `${data[code + '-address']}, ${data[code + '-town']}, ${data[code + '-postcode']}`
    loc.url = data[code + '-url']
    loc.picked = data[code + '-location-picked']
  }

  res.redirect('/locations?created=true')
})

router.all('/new-location/:code/:view', function (req, res) {
  const code = req.params.code
  res.render(`new-location/${req.params.view}`, { code, paths: newLocationWizardPaths(req) })
})

router.all('/onboarding/:view', function (req, res) {
  res.render(`onboarding/${req.params.view}`, { paths: onboardingWizardPaths(req) })
})

router.get('/about-your-organisation', function (req, res) {
  const errors = validateOrg(req.session.data)
  res.render('about-your-organisation/index', { errors: errors, justPublished: (req.query.publish && errors.length === 0) })
})

router.get('/about-your-organisation/edit', function (req, res) {
  const errors = validateOrg(req.session.data, 'about-your-organisation')
  res.render('about-your-organisation/edit', { errors: errors })
})

router.get('/about-your-organisation/contact', function (req, res) {
  const errors = validateOrg(req.session.data, 'contact-details')
  res.render('about-your-organisation/contact', { errors: errors })
})

router.post('/about-your-organisation', function (req, res) {
  req.session.data['about-your-organisation-publish-state'] = 'draft'
  res.render('about-your-organisation/index', { showMessage: true, publishState: 'draft' })
})

router.get('/preview/about-your-organisation', function (req, res) {
  res.render('preview-organisation-information')
})

router.get('/publish/about-your-organisation', function (req, res) {
  const errors = validateOrg(req.session.data)

  if (errors.length > 0) {
    req.session.data['about-your-organisation-show-publish-errors'] = errors.length > 0
  } else {
    req.session.data['about-your-organisation-publish-state'] = 'published'
    req.session.data['about-your-organisation-published-before'] = true
  }

  res.redirect('/about-your-organisation/index?publish=true')
})

// Publish course action
router.get('/publish/:providerCode/:code', function (req, res) {
  const c = course(req)
  const errors = validate(req.session.data, c)

  if (errors.length > 0) {
    req.session.data[c.programmeCode + '-show-publish-errors'] = errors.length > 0
  } else {
    req.session.data[c.programmeCode + '-publish-state'] = 'published'
    req.session.data[c.programmeCode + '-published-before'] = true
  }

  res.redirect('/course/' + req.params.providerCode + '/' + req.params.code + '?publish=true')
})

// Course page
router.get('/course/:providerCode/:code', function (req, res) {
  const c = course(req)
  const errors = validate(req.session.data, c)

  res.render('course/index', {
    course: c,
    errors: errors,
    justCreated: req.query.created,
    justEdited: req.query.edited,
    justEditedAndPublished: req.query.editedAndPublished,
    justWithdrawn: req.query.withdrawn,
    justPublished: (req.query.publish && errors.length === 0)
  })
})

// Post to course page
router.post('/course/:providerCode/:code', function (req, res) {
  const c = course(req)
  const data = req.session.data
  const state = data[c.programmeCode + '-published-before'] ? 'published-with-changes' : 'draft'

  data[c.programmeCode + '-publish-state'] = state

  res.render('course/index', {
    course: c,
    errors: validate(data, c),
    publishState: state,
    showMessage: true
  })
})

// Post to course degree requirements page
router.post('/course/:providerCode/:code/degree', function (req, res) {
  const c = course(req)
  const choice = req.body[req.params.code + '-degree-minimum-required']

  if (choice === 'Yes') {
    // Redirect to minimum course requirements page
    res.redirect(`/course/${req.params.providerCode}/${req.params.code}/degree-level`)
  } else if (c.subject !== 'Primary') {
    // Redirect to degree subject requirements page (unless it’s a Primary course)
    res.redirect(`/course/${req.params.providerCode}/${req.params.code}/degree-subject`)
  } else {
    // Redirect back to course page
    res.redirect(`/course/${req.params.providerCode}/${req.params.code}`)
  }
})

// Post to vacancies page
router.post('/course/:providerCode/:code/vacancies', function (req, res) {
  const c = course(req)
  const data = req.session.data

  if (!data[course.programmeCode + '-multi-location'] && req.body[c.programmeCode + '-vacancies-choice'] === '_unchecked') {
    res.render('course/vacancies', {
      course: c,
      showErrors: true
    })
  } else {
    let choice = req.body[c.programmeCode + '-vacancies-choice']
    if (Array.isArray(choice)) {
      choice = choice[0]
    }

    if (choice.includes('no vacancies')) {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'No'
    } else if (choice.includes('are vacancies')) {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'Yes'
    } else if (choice === 'There are some vacancies') {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'Yes'
    }
    res.redirect('/courses?editedVacancies=true')
  }
})

router.post('/course/:providerCode/:code/delete', function (req, res) {
  const data = req.session.data
  data.ucasCourses = data.ucasCourses.filter(function (c) { return c.programmeCode !== req.params.code })
  res.redirect('/courses?deleted=true')
})

router.post('/course/:providerCode/:code/withdraw', function (req, res) {
  const c = course(req)
  req.session.data[c.programmeCode + '-publish-state'] = 'withdrawn'
  res.redirect('/course/' + req.params.providerCode + '/' + req.params.code + '?withdrawn=true')
})

router.get('/course-not-running/:providerCode/:code', function (req, res) {
  const c = course(req)

  res.render('course/not-running', { course: c })
})

router.get('/preview/:providerCode/:code', function (req, res) {
  const c = course(req)
  const code = c.programmeCode

  res.render('preview', { course: c, code })
})

router.get('/course/:providerCode/:code/:view', function (req, res) {
  const { code, view } = req.params
  const c = course(req)

  res.render(`course/${view}`, {
    course: c,
    code,
    errors: validate(req.session.data, c, view)
  })
})

router.get('/location/upload', function (req, res) {
  res.render('location/upload')
})

router.get('/location/upload-review', function (req, res) {
  const data = req.session.data
  const locations = JSON.parse(JSON.stringify(data.schools))

  res.render('location/upload-review', {
    locations: locations
  })
})

router.get('/location/start', function (req, res) {
  const existingCodes = req.session.data.schools.map(s => s.code)
  const code = generateLocationCode(existingCodes)
  res.redirect(`/location/${code}`)
})

router.get('/location/:code', function (req, res) {
  const code = req.params.code
  const data = req.session.data
  const school = data.schools.find(school => school.code === code)

  const isNew = !school
  res.render('location/index', {
    school: school,
    code,
    isNew: isNew
  })
})

router.post('/location/:code', function (req, res) {
  const code = req.params.code
  const data = req.session.data
  let school = data.schools.find(function (school) {
    return school.code === req.params.code
  })
  let isNew = false

  if (!school && req.body[code + '-location-confirm'] === '_unchecked') {
    res.render('location/index', {
      school,
      code,
      showErrors: true,
      isNew: true
    })

    return
  }

  if (!school) {
    school = {}
    data.schools.push(school)
    isNew = true
  }

  school.name = data[code + '-name']
  school.urn = data[code + '-urn']
  school.placement = data[code + '-location-type'] === 'Placement school'
  school.address = `${data[code + '-address']}, ${data[code + '-town']}, ${data[code + '-postcode']}`
  school.postcode = data[code + '-postcode']
  school.code = code

  res.redirect(`/locations?success=${isNew ? 'new' : 'edited'}&code=${school.code}`)
})

router.all('/locations', function (req, res) {
  const data = req.session.data
  const locations = JSON.parse(JSON.stringify(data.schools))

  locations.forEach(location => {
    location.courses = data.ucasCourses.filter(a => a.schools.find(school => school.code === location.code)).length
    location.placement = location.code !== '-'
  })

  res.render('locations/index', {
    locations: locations,
    justCreated: req.query.success === 'new',
    justEdited: req.query.success === 'edited',
    justUploaded: req.query.success === 'uploaded',
    justChangedCode: req.query.code
  })
})

router.get('/accredited-body/:code', function (req, res) {
  const p = provider(req)
  res.render('accredited-body/provider-courses', { provider: p })
})

// Notifications
router.post('/notifications', function (req, res) {
  res.render('organisation/index', { showMessage: true })
})

// Invite user flow

router.post('/users/basic-details', (req, res) => {
  res.redirect('/users/what-access')
})

router.post('/users/what-access', function (req, res) {
  const whatAccess = req.session.data['what-access']

  if (whatAccess === 'same') {
    res.redirect('/users/permissions-1')
  } else {
    res.redirect('/users/organisations')
  }
})

router.post('/users/organisations', (req, res) => {
  res.redirect('/users/permissions-1')
})

router.post('/users/permissions-1', (req, res) => {
  res.redirect('/users/whose-courses-1')
})

router.post('/users/whose-courses-1', (req, res) => {
  res.redirect('/users/permissions-2')
})

router.post('/users/permissions-2', (req, res) => {
  res.redirect('/users/permissions-3')
})

router.post('/users/permissions-3', (req, res) => {
  res.redirect('/users/check')
})

router.post('/users/check', function (req, res) {
  res.render('users', { showMessage: true })
})

// Check answers
// TODO: The routes for the manage courses

// Allocations

router.post('/allocations/offer-pe', function (req, res) {
  const offeringPE = req.session.data['offer-pe']

  if (offeringPE === 'Yes') {
    res.redirect('/allocations/request-sent')
  } else {
    res.redirect('/allocations/no-request-confirmed')
  }
})

module.exports = router
