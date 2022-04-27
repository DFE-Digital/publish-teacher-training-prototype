const express = require('express')
const router = express.Router()

const passport = require('passport')

// Controller modules
const accountController = require('./controllers/account')
const accreditedBodyController = require('./controllers/accredited-bodies')
const authenticationController = require('./controllers/authentication')
const courseController = require('./controllers/courses')
const dataController = require('./controllers/data')
const locationController = require('./controllers/locations')
const organisationController = require('./controllers/organisations')
const partnerController = require('./controllers/partners')
const userController = require('./controllers/users')

// Authentication middleware
const checkIsAuthenticated = (req, res, next) => {
  if (req.session.passport) {
    // the signed in user
    res.locals.passport = req.session.passport
    // the base URL for navigation
    res.locals.baseUrl = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    next()
  } else {
    delete req.session.data
    res.redirect('/sign-in')
  }
}

/// ------------------------------------------------------------------------ ///
/// ALL ROUTES
/// ------------------------------------------------------------------------ ///

router.all('*', (req, res, next) => {
  res.locals.referrer = req.query.referrer
  res.locals.query = req.query
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})

/// ------------------------------------------------------------------------ ///
/// AUTHENTICATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/sign-in', authenticationController.sign_in_get)
router.post('/sign-in', passport.authenticate('local', {
  successRedirect: '/auth',
  failureRedirect: '/sign-in',
  failureFlash: 'Enter valid sign-in details'
}))

router.get('/auth', authenticationController.auth_get)

router.get('/sign-out', authenticationController.sign_out_get)

router.get('/register', authenticationController.register_get)
router.post('/register', authenticationController.register_post)

router.get('/confirm-email', authenticationController.confirm_email_get)
router.post('/confirm-email', authenticationController.confirm_email_post)

router.get('/resend-code', authenticationController.resend_code_get)
router.post('/resend-code', authenticationController.resend_code_post)

router.get('/forgotten-password', authenticationController.forgotten_password_get)
router.post('/forgotten-password', authenticationController.forgotten_password_post)

router.get('/verification-code', authenticationController.verification_code_get)
router.post('/verification-code', authenticationController.verification_code_post)

router.get('/create-password', authenticationController.create_password_get)
router.post('/create-password', authenticationController.create_password_post)

router.get('/password-reset', authenticationController.password_reset_get)
router.post('/password-reset', authenticationController.password_reset_post)

router.get('/registration-complete', authenticationController.registration_complete_get)

router.get('/terms-and-conditions', authenticationController.terms_and_conditions_get)

/// ------------------------------------------------------------------------ ///
/// YOUR ACCOUNT ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/account/notifications/organisations/:organisationId/edit', checkIsAuthenticated, accountController.edit_notifications_get)
router.post('/account/notifications/organisations/:organisationId/edit', checkIsAuthenticated, accountController.edit_notifications_post)

router.get('/account/notifications/organisations', checkIsAuthenticated, (req, res) => {
  res.redirect('/account/notifications')
})

router.get('/account/notifications', checkIsAuthenticated, accountController.notification_details)

router.get('/account/personal-details', checkIsAuthenticated, accountController.personal_details)

router.get('/account', checkIsAuthenticated, accountController.user_account)

/// ------------------------------------------------------------------------ ///
/// COURSE ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/subject-level', checkIsAuthenticated, courseController.new_course_subject_level_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/subject-level', checkIsAuthenticated, courseController.new_course_subject_level_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/subject', checkIsAuthenticated, courseController.new_course_subject_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/subject', checkIsAuthenticated, courseController.new_course_subject_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/modern-language', checkIsAuthenticated, courseController.new_course_modern_language_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/modern-language', checkIsAuthenticated, courseController.new_course_modern_language_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/age-range', checkIsAuthenticated, courseController.new_course_age_range_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/age-range', checkIsAuthenticated, courseController.new_course_age_range_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/qualification', checkIsAuthenticated, courseController.new_course_qualification_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/qualification', checkIsAuthenticated, courseController.new_course_qualification_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/funding-type', checkIsAuthenticated, courseController.new_course_funding_type_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/funding-type', checkIsAuthenticated, courseController.new_course_funding_type_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/apprenticeship', checkIsAuthenticated, courseController.new_course_apprenticeship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/apprenticeship', checkIsAuthenticated, courseController.new_course_apprenticeship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/study-mode', checkIsAuthenticated, courseController.new_course_study_mode_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/study-mode', checkIsAuthenticated, courseController.new_course_study_mode_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/location', checkIsAuthenticated, courseController.new_course_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/location', checkIsAuthenticated, courseController.new_course_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-body', checkIsAuthenticated, courseController.new_course_accredited_body_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-body', checkIsAuthenticated, courseController.new_course_accredited_body_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/visa-sponsorship', checkIsAuthenticated, courseController.new_course_visa_sponsorship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/visa-sponsorship', checkIsAuthenticated, courseController.new_course_visa_sponsorship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courseController.new_course_applications_open_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courseController.new_course_applications_open_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start', checkIsAuthenticated, courseController.new_course_start_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start', checkIsAuthenticated, courseController.new_course_start_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courseController.new_course_check_answers_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courseController.new_course_check_answers_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new', checkIsAuthenticated, courseController.new_course_get)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/special-educational-needs-disability', checkIsAuthenticated, courseController.edit_course_send_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/special-educational-needs-disability', checkIsAuthenticated, courseController.edit_course_send_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/subject', checkIsAuthenticated, courseController.edit_course_subject_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/subject', checkIsAuthenticated, courseController.edit_course_subject_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/modern-language', checkIsAuthenticated, courseController.edit_course_modern_language_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/modern-language', checkIsAuthenticated, courseController.edit_course_modern_language_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/age-range', checkIsAuthenticated, courseController.edit_course_age_range_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/age-range', checkIsAuthenticated, courseController.edit_course_age_range_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/qualification', checkIsAuthenticated, courseController.edit_course_qualification_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/qualification', checkIsAuthenticated, courseController.edit_course_qualification_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/funding-type', checkIsAuthenticated, courseController.edit_course_funding_type_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/funding-type', checkIsAuthenticated, courseController.edit_course_funding_type_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/apprenticeship', checkIsAuthenticated, courseController.edit_course_apprenticeship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/apprenticeship', checkIsAuthenticated, courseController.edit_course_apprenticeship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/study-mode', checkIsAuthenticated, courseController.edit_course_study_mode_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/study-mode', checkIsAuthenticated, courseController.edit_course_study_mode_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/location', checkIsAuthenticated, courseController.edit_course_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/location', checkIsAuthenticated, courseController.edit_course_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/accredited-body', checkIsAuthenticated, courseController.edit_course_accredited_body_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/accredited-body', checkIsAuthenticated, courseController.edit_course_accredited_body_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/applications-open-date', checkIsAuthenticated, courseController.edit_course_applications_open_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/applications-open-date', checkIsAuthenticated, courseController.edit_course_applications_open_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-start', checkIsAuthenticated, courseController.edit_course_start_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-start', checkIsAuthenticated, courseController.edit_course_start_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/about-course', checkIsAuthenticated, courseController.edit_about_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/about-course', checkIsAuthenticated, courseController.edit_about_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/interview-process', checkIsAuthenticated, courseController.edit_interview_process_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/interview-process', checkIsAuthenticated, courseController.edit_interview_process_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placements', checkIsAuthenticated, courseController.edit_school_placements_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placements', checkIsAuthenticated, courseController.edit_school_placements_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/personal-qualities', checkIsAuthenticated, courseController.edit_personal_qualities_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/personal-qualities', checkIsAuthenticated, courseController.edit_personal_qualities_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/other-requirements', checkIsAuthenticated, courseController.edit_other_requirements_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/other-requirements', checkIsAuthenticated, courseController.edit_other_requirements_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-length', checkIsAuthenticated, courseController.edit_course_length_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-length', checkIsAuthenticated, courseController.edit_course_length_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-fees', checkIsAuthenticated, courseController.edit_course_fees_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-fees', checkIsAuthenticated, courseController.edit_course_fees_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/financial-support', checkIsAuthenticated, courseController.edit_financial_support_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/financial-support', checkIsAuthenticated, courseController.edit_financial_support_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/visa-sponsorship', checkIsAuthenticated, courseController.edit_course_visa_sponsorship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/visa-sponsorship', checkIsAuthenticated, courseController.edit_course_visa_sponsorship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/withdraw', checkIsAuthenticated, courseController.withdraw_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/withdraw', checkIsAuthenticated, courseController.withdraw_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/delete', checkIsAuthenticated, courseController.delete_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/delete', checkIsAuthenticated, courseController.delete_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/description', checkIsAuthenticated, courseController.course_description)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId', checkIsAuthenticated, courseController.course_details)

router.get('/organisations/:organisationId/cycles/:cycleId/courses', checkIsAuthenticated, courseController.course_list)

/// ------------------------------------------------------------------------ ///
/// LOCATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/locations/new', checkIsAuthenticated, locationController.new_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/locations/new', checkIsAuthenticated, locationController.new_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/locations/:locationId', checkIsAuthenticated, locationController.edit_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/locations/:locationId', checkIsAuthenticated, locationController.edit_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/locations/:locationId/delete', checkIsAuthenticated, locationController.delete_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/locations/:locationId/delete', checkIsAuthenticated, locationController.delete_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/locations', checkIsAuthenticated, locationController.location_list)

/// ------------------------------------------------------------------------ ///
/// USER ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/users/new', checkIsAuthenticated, userController.new_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/new', checkIsAuthenticated, userController.new_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit', checkIsAuthenticated, userController.edit_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit', checkIsAuthenticated, userController.edit_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId/delete', checkIsAuthenticated, userController.delete_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/:userId/delete', checkIsAuthenticated, userController.delete_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId', checkIsAuthenticated, userController.user_details)

router.get('/organisations/:organisationId/cycles/:cycleId/users', checkIsAuthenticated, userController.user_list)

/// ------------------------------------------------------------------------ ///
/// ACCREDITED BODY ORGANISATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new', checkIsAuthenticated, accreditedBodyController.new_accredited_body_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new', checkIsAuthenticated, accreditedBodyController.new_accredited_body_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/description', checkIsAuthenticated, accreditedBodyController.new_accredited_body_description_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/description', checkIsAuthenticated, accreditedBodyController.new_accredited_body_description_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/permissions', checkIsAuthenticated, accreditedBodyController.new_accredited_body_permissions_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/permissions', checkIsAuthenticated, accreditedBodyController.new_accredited_body_permissions_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/check', checkIsAuthenticated, accreditedBodyController.new_accredited_body_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/new/check', checkIsAuthenticated, accreditedBodyController.new_accredited_body_check_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/description', checkIsAuthenticated, accreditedBodyController.edit_accredited_body_description_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/description', checkIsAuthenticated, accreditedBodyController.edit_accredited_body_description_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/permissions', checkIsAuthenticated, accreditedBodyController.edit_accredited_body_permissions_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/permissions', checkIsAuthenticated, accreditedBodyController.edit_accredited_body_permissions_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/delete', checkIsAuthenticated, accreditedBodyController.delete_accredited_body_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-bodies/:accreditedBodyId/delete', checkIsAuthenticated, accreditedBodyController.delete_accredited_body_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-bodies', checkIsAuthenticated, accreditedBodyController.accredited_bodies_list)

/// ------------------------------------------------------------------------ ///
/// PARTNER ORGANISATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/partners/:partnerId/courses/:courseId/description', checkIsAuthenticated, partnerController.partner_course_description)

router.get('/organisations/:organisationId/cycles/:cycleId/partners/:partnerId/courses/:courseId', checkIsAuthenticated, partnerController.partner_course_details)

router.get('/organisations/:organisationId/cycles/:cycleId/partners/:partnerId/courses', checkIsAuthenticated, partnerController.partner_courses_list)

router.get('/organisations/:organisationId/cycles/:cycleId/partners', checkIsAuthenticated, partnerController.partners_list)

/// ------------------------------------------------------------------------ ///
/// ORGANISATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/details', checkIsAuthenticated, organisationController.organisation_details)

router.get('/organisations/:organisationId/cycles/:cycleId/edit', checkIsAuthenticated, organisationController.edit_organisation_details_get)
router.post('/organisations/:organisationId/cycles/:cycleId/edit', checkIsAuthenticated, organisationController.edit_organisation_details_post)

router.get('/organisations/:organisationId/cycles/:cycleId/training', checkIsAuthenticated, organisationController.edit_training_get)
router.post('/organisations/:organisationId/cycles/:cycleId/training', checkIsAuthenticated, organisationController.edit_training_post)

router.get('/organisations/:organisationId/cycles/:cycleId/training-with-disabilities', checkIsAuthenticated, organisationController.edit_disabilities_get)
router.post('/organisations/:organisationId/cycles/:cycleId/training-with-disabilities', checkIsAuthenticated, organisationController.edit_disabilities_post)

router.get('/organisations/:organisationId/cycles/:cycleId/contact-details', checkIsAuthenticated, organisationController.edit_contact_details_get)
router.post('/organisations/:organisationId/cycles/:cycleId/contact-details', checkIsAuthenticated, organisationController.edit_contact_details_post)

router.get('/organisations/:organisationId/cycles/:cycleId/student-visa', checkIsAuthenticated, organisationController.edit_student_visa_get)
router.post('/organisations/:organisationId/cycles/:cycleId/student-visa', checkIsAuthenticated, organisationController.edit_student_visa_post)

router.get('/organisations/:organisationId/cycles/:cycleId/skilled-worker-visa', checkIsAuthenticated, organisationController.edit_skilled_worker_visa_get)
router.post('/organisations/:organisationId/cycles/:cycleId/skilled-worker-visa', checkIsAuthenticated, organisationController.edit_skilled_worker_visa_post)

router.get('/organisations/:organisationId/cycles/:cycleId', checkIsAuthenticated, organisationController.organisation)

router.get('/organisations', checkIsAuthenticated, organisationController.organisations_list)

router.get('/', checkIsAuthenticated, (req, res) => {
  res.redirect('/organisations')
})

/// ------------------------------------------------------------------------ ///
/// PROTOTYPE ADMIN
/// ------------------------------------------------------------------------ ///

router.get('/prototype-admin/clear-data', checkIsAuthenticated, (req, res) => {
  delete req.session.data
  delete req.session.passport
  res.redirect('/')
})

router.get('/seed', dataController.seed)

/// ------------------------------------------------------------------------ ///
/// END
/// ------------------------------------------------------------------------ ///
module.exports = router
