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
  onboardingWizardPaths,
  placementsWizardPaths,
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

router.all(['/:flow(new|edit)/:code/placement-locations', '/new/:code/further/placement-locations'], function (req, res) {
  const data = req.session.data
  const { code, flow } = req.params
  const checkedLocations = data[`${code}-locations`] || []
  const schoolLocations = data.schools.filter(school => school.type.includes('school'))
  const items = []

  schoolLocations.forEach(location => {
    items.push({
      value: location.name,
      text: location.name,
      checked: checkedLocations.includes(location.name),
      label: {
        classes: 'govuk-label--s'
      },
      hint: {
        text: `${location['address-line1']}, ${location['address-level1']}, ${location['postal-code']}`
      }
    })
  })

  res.render('new/placement-locations', {
    paths: newCourseWizardPaths(req),
    code,
    schoolLocations,
    items,
    editing: flow === 'edit'
  })
})

router.all(['/:flow(new|edit)/:code/training-locations'], function (req, res) {
  const data = req.session.data
  const { code, flow } = req.params
  const checkedLocations = data[`${code}-training-locations`] || []
  const trainingLocations = data.schools.filter(school => school.type === 'centre');
  const items = []

  trainingLocations.forEach(location => {
    items.push({
      value: location.urn,
      text: location.name + ', ' + location['address-level2'],
      checked: checkedLocations.includes(location.urn),
      label: {
        classes: 'govuk-label--s'
      },
      hint: {
        text: `${location['address-line1']}, ${location['address-level1']}, ${location['postal-code']}`
      }
    })
  })

  res.render('new/training-locations', {
    paths: newCourseWizardPaths(req),
    code,
    trainingLocations,
    items,
    editing: flow === 'edit'
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

router.all(['/edit/:code/editing-title', '/edit/:code/further/editing-title'], function (req, res) {
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

router.post('/:flow(new|edit)/:code/languages', function (req, res) {
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

router.get('/:flow(new|edit)/:code/accredited-body', function (req, res) {
  const { code, flow } = req.params
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
    accreditors,
    editing: flow === 'edit'
  })
})

router.all('/:flow(new|edit)/:code/:view', function (req, res) {
  const { code, view, flow } = req.params

  res.render(`new/${view}`, {
    code,
    paths: newCourseWizardPaths(req),
    editing: flow === 'edit'
  })
})

router.all('/:flow(new|edit)/:code/further/:view', function (req, res) {
  const { code, view, flow } = req.params
  const locals = {
    code,
    paths: newFurtherEducationCourseWizardPaths(req),
    editing: flow === 'edit'
  }

  // Render the non-specific FE view
  res.render(`new/further/${view}`, locals, function (err, html) {
    if (err) {
      if (err.message.indexOf('template not found') !== -1) {
        return res.render(`new/${view}`, locals)
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

  loc.type = data[code + '-location-types']
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
  const schoolLocations = req.session.data.schools.filter(school => school.type.includes('school'))

  res.render('course/index', {
    course: c,
    errors: errors,
    justCreated: req.query.created,
    justEdited: req.query.edited,
    justEditedAndPublished: req.query.editedAndPublished,
    justWithdrawn: req.query.withdrawn,
    justPublished: (req.query.publish && errors.length === 0),
    schoolLocations
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
  const schoolLocations = req.session.data.schools.filter(school => school.type.includes('school'))

  res.render('preview', { course: c, code, schoolLocations })
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

router.get('/location/start', function (req, res) {
  const { type, referrer } = req.query
  const existingCodes = req.session.data.schools.map(s => s.code)
  const code = generateLocationCode(existingCodes)

  if (referrer) {
    res.redirect(`/location/${code}?type=${type}&referrer=${referrer}`)
  } else {
    res.redirect(`/location/${code}?type=${type}`)
  }
})

router.get('/location/:id', function (req, res) {
  const { type, referrer } = req.query
  const { id } = req.params
  const { data } = req.session

  const school = data.schools.find(school => school.urn === id || school.code === id)
  const isNew = !school

  res.render('location/index', {
    school: school,
    id: id,
    type: type || 'school',
    referrer,
    isNew: isNew
  })
})

router.post('/location/:id', function (req, res) {
  const { id } = req.params
  const { data } = req.session
  const { referrer } = req.query

  let school = data.schools.find(school => school.urn === id || school.code === id)
  let isNew = false

  if (!school) {
    school = {}
    data.schools.push(school)
    isNew = true
  }

  school.urn = data[id + '-urn']
  school.name = data[id + '-name']
  school.type = data[id + '-location-type']
  school['address-line1'] = data[id + '-address-line1']
  school['address-line2'] = data[id + '-address-line2']
  school['address-level2'] = data[id + '-address-level2']
  school['address-level1'] = data[id + '-address-level1']
  school['postal-code'] = data[id + '-postal-code']

  delete school.code

  res.redirect(referrer || `/locations?success=${isNew ? 'new' : 'edited'}`)
})

router.post('/locations/upload-data', function (req, res) {
  const data = req.session.data
  data.schools = data.schools.concat(data.uploadedLocations)

  res.redirect('/locations?success=uploaded')
})

router.all('/locations', function (req, res) {
  const { schools, ucasCourses } = req.session.data

  schools.forEach(location => {
    location.courses = ucasCourses.filter(a => a.schools.find(school => school.urn === location.urn)).length
  })

  const centerLocations = schools.filter(school => school.type.includes('centre'))
  const schoolLocations = schools.filter(school => school.type.includes('school'))

  res.render('locations/index', {
    centerLocations,
    schoolLocations,
    justCreated: req.query.success === 'new',
    justEdited: req.query.success === 'edited',
    justUploaded: req.query.success === 'uploaded'
  })
})

router.get('/locations/add', function (req, res) {
  const paths = placementsWizardPaths(req)
  paths.next = '/locations/add-answer'

  res.render('locations/add', {
    paths
  })
})

router.get('/locations/upload-review', function (req, res) {
  const { data } = req.session
  const locations = JSON.parse(JSON.stringify(data.schools))

  res.render('locations/upload-review', {
    locations: locations
  })
})

router.post('/locations/add-answer', function (req, res) {
  const { data } = req.session

  if (data['add-placements-answer'] === 'upload') {
    res.redirect('/locations/upload?referrer=/locations/add')
  } else {
    res.redirect('/location/start?type=school&referrer=/locations/add')
  }
})

router.post('/locations/placements-policy', function (req, res) {
  const { data } = req.session
  const { referrer } = req.query
  const schoolLocations = data.schools.filter(school => school.type.includes('school'))

  if (data['placements-display'] === 'area') {
    delete data['placements-policy']
    res.redirect(schoolLocations.length === 0 ? '/locations/add' : '/locations')
  } else {
    res.render('locations/placements-policy', {
      paths: placementsWizardPaths(req),
      referrer
    })
  }
})

router.get('/locations/:view', function (req, res) {
  res.render(`locations/${req.params.view}`, {
    paths: placementsWizardPaths(req),
    referrer: req.query.referrer
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
