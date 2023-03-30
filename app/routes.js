const express = require('express')
const router = express.Router()

const passport = require('passport')

// Controller modules
const accountController = require('./controllers/account')
const accreditedProviderController = require('./controllers/accredited-providers')
const authenticationController = require('./controllers/authentication')
const courseController = require('./controllers/courses')
const cycleController = require('./controllers/cycles')
const dataController = require('./controllers/data')
const degreeController = require('./controllers/degrees')
const examplesController = require('./controllers/examples')
const gcseController = require('./controllers/gcses')
const guidanceController = require('./controllers/guidance')
const locationController = require('./controllers/locations')
const organisationController = require('./controllers/organisations')
const trainingPartnerController = require('./controllers/training-partners')
const userController = require('./controllers/users')
const vacancyController = require('./controllers/vacancies')

// Authentication middleware
const checkIsAuthenticated = (req, res, next) => {
  if (req.session.passport) {
    // the signed in user
    res.locals.passport = req.session.passport
    // the base URL for navigation
    res.locals.baseUrl = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    res.locals.cycleId = req.params.cycleId
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

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/campaign', checkIsAuthenticated, courseController.new_course_campaign_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/campaign', checkIsAuthenticated, courseController.new_course_campaign_post)

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

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/school-placements', checkIsAuthenticated, courseController.new_course_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/school-placements', checkIsAuthenticated, courseController.new_course_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-provider', checkIsAuthenticated, courseController.new_course_accredited_provider_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/accredited-provider', checkIsAuthenticated, courseController.new_course_accredited_provider_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/visa-sponsorship', checkIsAuthenticated, courseController.new_course_visa_sponsorship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/visa-sponsorship', checkIsAuthenticated, courseController.new_course_visa_sponsorship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courseController.new_course_applications_open_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/applications-open-date', checkIsAuthenticated, courseController.new_course_applications_open_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start', checkIsAuthenticated, courseController.new_course_start_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/course-start', checkIsAuthenticated, courseController.new_course_start_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courseController.new_course_check_answers_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/new/check', checkIsAuthenticated, courseController.new_course_check_answers_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/new', checkIsAuthenticated, courseController.new_course_get)

/// DEGREE ROUTES
router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree', checkIsAuthenticated, degreeController.edit_degree_minimum_classification_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree', checkIsAuthenticated, degreeController.edit_degree_minimum_classification_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree/classification', checkIsAuthenticated, degreeController.edit_degree_classification_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree/classification', checkIsAuthenticated, degreeController.edit_degree_classification_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree/subject-requirements', checkIsAuthenticated, degreeController.edit_degree_subject_requirements_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/degree/subject-requirements', checkIsAuthenticated, degreeController.edit_degree_subject_requirements_post)

/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/special-educational-needs-disability', checkIsAuthenticated, courseController.edit_course_send_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/special-educational-needs-disability', checkIsAuthenticated, courseController.edit_course_send_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/subject', checkIsAuthenticated, courseController.edit_course_subject_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/subject', checkIsAuthenticated, courseController.edit_course_subject_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/modern-language', checkIsAuthenticated, courseController.edit_course_modern_language_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/modern-language', checkIsAuthenticated, courseController.edit_course_modern_language_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/campaign', checkIsAuthenticated, courseController.edit_course_campaign_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/campaign', checkIsAuthenticated, courseController.edit_course_campaign_post)

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

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placements', checkIsAuthenticated, courseController.edit_course_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placements', checkIsAuthenticated, courseController.edit_course_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/accredited-provider', checkIsAuthenticated, courseController.edit_course_accredited_provider_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/accredited-provider', checkIsAuthenticated, courseController.edit_course_accredited_provider_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/applications-open-date', checkIsAuthenticated, courseController.edit_course_applications_open_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/applications-open-date', checkIsAuthenticated, courseController.edit_course_applications_open_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-start', checkIsAuthenticated, courseController.edit_course_start_date_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/course-start', checkIsAuthenticated, courseController.edit_course_start_date_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/about-course', checkIsAuthenticated, courseController.edit_about_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/about-course', checkIsAuthenticated, courseController.edit_about_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/interview-process', checkIsAuthenticated, courseController.edit_interview_process_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/interview-process', checkIsAuthenticated, courseController.edit_interview_process_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placement-details', checkIsAuthenticated, courseController.edit_school_placements_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/school-placement-details', checkIsAuthenticated, courseController.edit_school_placements_post)

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

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/salary-details', checkIsAuthenticated, courseController.edit_salary_details_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/salary-details', checkIsAuthenticated, courseController.edit_salary_details_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/gcses', checkIsAuthenticated, gcseController.edit_gcses_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/gcses', checkIsAuthenticated, gcseController.edit_gcses_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/visa-sponsorship', checkIsAuthenticated, courseController.edit_course_visa_sponsorship_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/visa-sponsorship', checkIsAuthenticated, courseController.edit_course_visa_sponsorship_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/withdraw', checkIsAuthenticated, courseController.withdraw_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/withdraw', checkIsAuthenticated, courseController.withdraw_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/delete', checkIsAuthenticated, courseController.delete_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/delete', checkIsAuthenticated, courseController.delete_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/rollover', checkIsAuthenticated, courseController.rollover_course_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/rollover', checkIsAuthenticated, courseController.rollover_course_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/description', checkIsAuthenticated, courseController.course_description)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/preview', checkIsAuthenticated, courseController.course_preview)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId', checkIsAuthenticated, courseController.course_details)

router.get('/organisations/:organisationId/cycles/:cycleId/courses', checkIsAuthenticated, courseController.course_list)

/// ------------------------------------------------------------------------ ///
/// VACANCIES ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies', checkIsAuthenticated, vacancyController.vacancy_details)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/edit', checkIsAuthenticated, vacancyController.edit_vacancies_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/edit', checkIsAuthenticated, vacancyController.edit_vacancies_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/school-placements', checkIsAuthenticated, vacancyController.edit_vacancies_locations_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/school-placements', checkIsAuthenticated, vacancyController.edit_vacancies_locations_post)

router.get('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/check', checkIsAuthenticated, vacancyController.edit_vacancies_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/courses/:courseId/vacancies/check', checkIsAuthenticated, vacancyController.edit_vacancies_check_post)

/// ------------------------------------------------------------------------ ///
/// LOCATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/schools/new', checkIsAuthenticated, locationController.new_location_find_get)
router.post('/organisations/:organisationId/cycles/:cycleId/schools/new', checkIsAuthenticated, locationController.new_location_find_post)

router.get('/organisations/:organisationId/cycles/:cycleId/schools/new/edit', checkIsAuthenticated, locationController.new_location_edit_get)
router.post('/organisations/:organisationId/cycles/:cycleId/schools/new/edit', checkIsAuthenticated, locationController.new_location_edit_post)

router.get('/organisations/:organisationId/cycles/:cycleId/schools/new/check', checkIsAuthenticated, locationController.new_location_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/schools/new/check', checkIsAuthenticated, locationController.new_location_check_post)

router.get('/organisations/:organisationId/cycles/:cycleId/schools/:locationId/edit', checkIsAuthenticated, locationController.edit_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/schools/:locationId/edit', checkIsAuthenticated, locationController.edit_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/schools/:locationId/delete', checkIsAuthenticated, locationController.delete_location_get)
router.post('/organisations/:organisationId/cycles/:cycleId/schools/:locationId/delete', checkIsAuthenticated, locationController.delete_location_post)

router.get('/organisations/:organisationId/cycles/:cycleId/schools/:locationId', checkIsAuthenticated, locationController.location_details)

router.get('/organisations/:organisationId/cycles/:cycleId/schools', checkIsAuthenticated, locationController.location_list)

/// ------------------------------------------------------------------------ ///
/// USER ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/users/new', checkIsAuthenticated, userController.new_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/new', checkIsAuthenticated, userController.new_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/new/check', checkIsAuthenticated, userController.new_user_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/new/check', checkIsAuthenticated, userController.new_user_check_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit', checkIsAuthenticated, userController.edit_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit', checkIsAuthenticated, userController.edit_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit/check', checkIsAuthenticated, userController.edit_user_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/:userId/edit/check', checkIsAuthenticated, userController.edit_user_check_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId/delete', checkIsAuthenticated, userController.delete_user_get)
router.post('/organisations/:organisationId/cycles/:cycleId/users/:userId/delete', checkIsAuthenticated, userController.delete_user_post)

router.get('/organisations/:organisationId/cycles/:cycleId/users/:userId', checkIsAuthenticated, userController.user_details)

router.get('/organisations/:organisationId/cycles/:cycleId/users', checkIsAuthenticated, userController.user_list)

/// ------------------------------------------------------------------------ ///
/// ACCREDITED PROVIDER ORGANISATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/description', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_description_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/description', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_description_post)

// router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/permissions', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_permissions_get)
// router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/permissions', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_permissions_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/check', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_check_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/new/check', checkIsAuthenticated, accreditedProviderController.new_accredited_provider_check_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/description', checkIsAuthenticated, accreditedProviderController.edit_accredited_provider_description_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/description', checkIsAuthenticated, accreditedProviderController.edit_accredited_provider_description_post)

// router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/permissions', checkIsAuthenticated, accreditedProviderController.edit_accredited_provider_permissions_get)
// router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/permissions', checkIsAuthenticated, accreditedProviderController.edit_accredited_provider_permissions_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/delete', checkIsAuthenticated, accreditedProviderController.delete_accredited_provider_get)
router.post('/organisations/:organisationId/cycles/:cycleId/accredited-providers/:accreditedBodyId/delete', checkIsAuthenticated, accreditedProviderController.delete_accredited_provider_post)

router.get('/organisations/:organisationId/cycles/:cycleId/accredited-providers', checkIsAuthenticated, accreditedProviderController.accredited_providers_list)

/// ------------------------------------------------------------------------ ///
/// TRAINING PARTNER ORGANISATION ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/organisations/:organisationId/cycles/:cycleId/training-partners/:partnerId/courses/:courseId/vacancies', checkIsAuthenticated, trainingPartnerController.partner_course_vacancies)

router.get('/organisations/:organisationId/cycles/:cycleId/training-partners/:partnerId/courses/:courseId/description', checkIsAuthenticated, trainingPartnerController.partner_course_description)

router.get('/organisations/:organisationId/cycles/:cycleId/training-partners/:partnerId/courses/:courseId', checkIsAuthenticated, trainingPartnerController.partner_course_details)

router.get('/organisations/:organisationId/cycles/:cycleId/training-partners/:partnerId/courses', checkIsAuthenticated, trainingPartnerController.partner_courses_list)

router.get('/organisations/:organisationId/cycles/:cycleId/training-partners', checkIsAuthenticated, trainingPartnerController.partners_list)

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

router.get('/organisations/:organisationId/cycles', checkIsAuthenticated, cycleController.cycle_list)

router.get('/organisations/cycles/:cycleId', checkIsAuthenticated, organisationController.organisations_list)
router.get('/organisations', checkIsAuthenticated, organisationController.organisations_list)

router.get('/', checkIsAuthenticated, (req, res) => {
  res.redirect('/organisations')
})

/// ------------------------------------------------------------------------ ///
/// GUIDANCE ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/how-to-use-this-service/:fileName', guidanceController.guidance)

router.get('/how-to-use-this-service', guidanceController.guidance)


/// ------------------------------------------------------------------------ ///
/// AUTOCOMPLETE ROUTES
/// ------------------------------------------------------------------------ ///

router.get('/accredited-provider-suggestions', accreditedProviderController.accredited_provider_suggestions_json)

router.get('/school-suggestions', locationController.school_suggestions_json)

/// ------------------------------------------------------------------------ ///
/// EXAMPLES
/// ------------------------------------------------------------------------ ///

router.get('/examples/schools', (req, res) => {
  res.redirect('/examples/schools/find')
})

router.get('/examples/schools/find', checkIsAuthenticated, examplesController.find_school_get)
router.post('/examples/schools/find', checkIsAuthenticated, examplesController.find_school_post)

router.get('/examples/schools/choose', checkIsAuthenticated, examplesController.choose_school_get)
router.post('/examples/schools/choose', checkIsAuthenticated, examplesController.choose_school_post)

router.get('/examples/schools/edit', checkIsAuthenticated, examplesController.edit_school_get)
router.post('/examples/schools/edit', checkIsAuthenticated, examplesController.edit_school_post)

router.get('/examples/accredited-providers', (req, res) => {
  res.redirect('/examples/accredited-providers/find')
})

router.get('/examples/accredited-providers', (req, res) => {
  res.redirect('/examples/accredited-providers/find')
})

router.get('/examples/accredited-providers/find', checkIsAuthenticated, examplesController.find_accredited_provider_get)
router.post('/examples/accredited-providers/find', checkIsAuthenticated, examplesController.find_accredited_provider_post)

router.get('/examples/accredited-providers/choose', checkIsAuthenticated, examplesController.choose_accredited_provider_get)
router.post('/examples/accredited-providers/choose', checkIsAuthenticated, examplesController.choose_accredited_provider_post)

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
/// ERRORS
/// ------------------------------------------------------------------------ ///

// page not found - 404
// https://design-system.service.gov.uk/patterns/page-not-found-pages/
router.get('/404', (req, res) => {
  if (req.session.passport) {
    // the signed in user
    res.locals.passport = req.session.passport
    // the base URL for navigation
    res.locals.baseUrl = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    res.locals.cycleId = req.params.cycleId
    res.render('./404', {
      baseUrl: res.locals.baseUrl
    })
  } else {
    res.render('./404', {
      hideAccountNavigation: true,
      hideOrganisationSwitcher: true,
      hidePrimaryNavigation: true
    })
  }
})

// internal server error - 500
// https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/
router.get('/500', (req, res) => {
  res.render('./500')
})

// service unavailable
// https://design-system.service.gov.uk/patterns/service-unavailable-pages/
router.get('/503', (req, res) => {
  res.render('./503')
})

// page not found
// router.get('*', (req, res) => {
//   const baseUrl = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
//   if (req.session.passport) {
//     // the signed in user
//     res.locals.passport = req.session.passport
//     res.render('./404', {
//       baseUrl
//     })
//   } else {
//     res.render('./404', {
//       baseUrl,
//       hideAccountNavigation: true,
//       hideOrganisationSwitcher: true,
//       hidePrimaryNavigation: true
//     })
//   }
// })

/// ------------------------------------------------------------------------ ///
/// END
/// ------------------------------------------------------------------------ ///
module.exports = router
