const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const organisationModel = require('../models/organisations')
const trainingPartnerModel = require('../models/training-partners')
const permissionsModel = require('../models/permissions')

const vacancyHelper = require('../helpers/vacancies')

exports.partners_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partners = trainingPartnerModel.findMany({ organisationId: req.params.organisationId })
  res.render('../views/training-partners/list', {
    organisation,
    partners
  })
}

/// ------------------------------------------------------------------------ ///
/// LIST PARTNER COURSES
/// ------------------------------------------------------------------------ ///

exports.partner_courses_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId })
  let courses = courseModel.findMany({ organisationId: req.params.partnerId, cycleId: req.params.cycleId })

  courses = courses.filter(course => {
    if (course.accreditedBody) {
      return course.accreditedBody.id === req.params.organisationId
    }
  })

  courses.sort((a, b) => {
    return a.name.localeCompare(b.name) ||
      a.qualification.localeCompare(b.qualification) ||
      a.studyMode.localeCompare(b.studyMode)
  })

  res.render('../views/training-partners/courses/list', {
    organisation,
    partner,
    permissions,
    courses,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PARTNER COURSE
/// ------------------------------------------------------------------------ ///

exports.partner_course_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const locations = locationModel.findMany({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.partnerId, courseId: req.params.courseId })

  res.render('../views/training-partners/courses/details', {
    organisation,
    partner,
    locations,
    permissions,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/description`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.partner_course_description = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.partnerId, courseId: req.params.courseId })

  res.render('../views/training-partners/courses/description', {
    organisation,
    partner,
    permissions,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/description`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.partner_course_vacancies = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.partnerId, courseId: req.params.courseId })
  const locationOptions = vacancyHelper.getLocationOptions(req.params.partnerId, req.params.courseId)

  res.render('../views/training-partners/courses/vacancies', {
    organisation,
    partner,
    permissions,
    course,
    locationOptions,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/description`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-partners/${req.params.partnerId}/courses/${req.params.courseId}/vacancies`
    }
  })
}
