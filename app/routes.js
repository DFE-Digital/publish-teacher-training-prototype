const express = require('express')
const router = express.Router()

const passport = require('passport')

// Controller modules
const authentication = require('./controllers/authentication.js')
const courses = require('./controllers/courses.js')
const locations = require('./controllers/locations.js')
const organisations = require('./controllers/organisations.js')

// Authentication middleware
const checkIsAuthenticated = (req, res, next) => {
  if (req.session.passport || req.session.data.user) {
    req.session.data.user = req.session.passport.user
    next()
  } else {
    res.redirect('/sign-in')
  }
}

/// --------------------------------------------------///
/// ALL ROUTES
/// --------------------------------------------------///

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

/// --------------------------------------------------///
/// AUTHENTICATION ROUTES
/// --------------------------------------------------///

router.get('/sign-in', authentication.sign_in_get)
// router.post('/sign-in', authentication.sign_in_post)
router.post('/sign-in', passport.authenticate('local', {
  successRedirect: '/auth',
  failureRedirect: '/sign-in',
  failureFlash: 'Enter valid sign-in details'
}))

router.get('/auth', authentication.auth_get)

router.get('/sign-out', authentication.sign_out_get)

router.get('/register', authentication.register_get)
router.post('/register', authentication.register_post)

router.get('/confirm-email', authentication.confirm_email_get)
router.post('/confirm-email', authentication.confirm_email_post)

router.get('/resend-code', authentication.resend_code_get)
router.post('/resend-code', authentication.resend_code_post)

router.get('/forgotten-password', authentication.forgotten_password_get)
router.post('/forgotten-password', authentication.forgotten_password_post)

router.get('/verification-code', authentication.verification_code_get)
router.post('/verification-code', authentication.verification_code_post)

router.get('/create-password', authentication.create_password_get)
router.post('/create-password', authentication.create_password_post)

router.get('/password-reset', authentication.password_reset_get)
router.post('/password-reset', authentication.password_reset_post)

router.get('/registration-complete', authentication.registration_complete_get)

router.get('/terms-and-conditions', authentication.terms_and_conditions_get)

/// --------------------------------------------------///
/// COURSE ROUTES
/// --------------------------------------------------///

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/subject-level', checkIsAuthenticated, courses.new_course_subbject_level_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/subject-level', checkIsAuthenticated, courses.new_course_subbject_level_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/subject', checkIsAuthenticated, courses.new_course_subject_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/subject', checkIsAuthenticated, courses.new_course_subject_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/age-range', checkIsAuthenticated, courses.new_course_age_range_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/age-range', checkIsAuthenticated, courses.new_course_age_range_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/qualification', checkIsAuthenticated, courses.new_course_qualification_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/qualification', checkIsAuthenticated, courses.new_course_qualification_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/funding-type', checkIsAuthenticated, courses.new_course_funding_type_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/funding-type', checkIsAuthenticated, courses.new_course_funding_type_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/study-mode', checkIsAuthenticated, courses.new_course_study_mode_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/study-mode', checkIsAuthenticated, courses.new_course_study_mode_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/location', checkIsAuthenticated, courses.new_course_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/location', checkIsAuthenticated, courses.new_course_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-body', checkIsAuthenticated, courses.new_course_accredited_body_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-body', checkIsAuthenticated, courses.new_course_accredited_body_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courses.new_course_applications_open_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courses.new_course_applications_open_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start-date', checkIsAuthenticated, courses.new_course_course_start_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start-date', checkIsAuthenticated, courses.new_course_course_start_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courses.new_course_check_answers_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courses.new_course_check_answers_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/description', checkIsAuthenticated, courses.course_description)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId', checkIsAuthenticated, courses.course_details)

router.get('/organisations/:organisationId/cycles/:cycleId/courses', checkIsAuthenticated, courses.course_list)

/// --------------------------------------------------///
/// LOCATION ROUTES
/// --------------------------------------------------///

// router.get('/organisations/:organisationId/cycles/:cycleId/locations/:locationId', checkIsAuthenticated, locations.show_get)
//
// router.get('/organisations/:organisationId/cycles/:cycleId/locations', checkIsAuthenticated, locations.list_get)

/// --------------------------------------------------///
/// ORGANISATION ROUTES
/// --------------------------------------------------///

// router.get('/organisations/:organisationId/cycles/:cycleId', checkIsAuthenticated, cycles.show_get)
//
// router.get('/organisations/:organisationId/cycles', checkIsAuthenticated, cycles.list_get)
//
// router.get('/organisations/:organisationId', checkIsAuthenticated, organisations.show_get)
//
// router.get('/organisations', checkIsAuthenticated, organisations.list_get)


// router.get('/', organisations.home_get)

/// --------------------------------------------------///
/// HOME ROUTES
/// --------------------------------------------------///

router.get('/', checkIsAuthenticated, (req, res) => {
  console.log(req.session.data);
  res.render('index', {})
})



module.exports = router
