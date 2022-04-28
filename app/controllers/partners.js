const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const partnerModel = require('../models/partners')
const permissionsModel = require('../models/permissions')

exports.partners_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partners = partnerModel.findMany({ organisationId: req.params.organisationId })
  res.render('../views/partners/list', {
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
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId})
  let courses = courseModel.findMany({ organisationId: req.params.partnerId })

  courses = courses.filter(course => {
    if (course.accreditedBody) {
      return course.accreditedBody.id === req.params.organisationId
    }
  })

  courses.sort((a,b) => {
    return a.name.localeCompare(b.name)
      || a.qualification.localeCompare(b.qualification)
      || a.studyMode.localeCompare(b.studyMode)
  })

  res.render('../views/partners/courses/list', {
    organisation,
    partner,
    permissions,
    courses,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW PARTNER COURSE
/// ------------------------------------------------------------------------ ///

exports.partner_course_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId})
  const course = courseModel.findOne({ organisationId: req.params.partnerId, courseId: req.params.courseId })

  res.render('../views/partners/courses/details', {
    organisation,
    partner,
    permissions,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.partner_course_description = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const partner = organisationModel.findOne({ organisationId: req.params.partnerId })
  const permissions = permissionsModel.findOne({ trainingPartnerId: req.params.partnerId, accreditedBodyId: req.params.organisationId})
  const course = courseModel.findOne({ organisationId: req.params.partnerId, courseId: req.params.courseId })

  res.render('../views/partners/courses/description', {
    organisation,
    partner,
    permissions,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/partners/${req.params.partnerId}/courses/${req.params.courseId}/description`
    }
  })
}
