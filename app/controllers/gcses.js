const courseModel = require('../models/courses')
const gcseModel = require('../models/gcses')
const organisationModel = require('../models/organisations')

exports.edit_gcses_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/gcses', {
    organisation,
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/gcses`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_gcses_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const errors = []

  if (errors.length) {
    res.render('../views/courses/gcses', {
      organisation,
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/gcses`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    gcseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'GCSEs and equivalency tests updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}
