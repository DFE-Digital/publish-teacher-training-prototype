const courseModel = require('../models/courses')
const gcseModel = require('../models/gcses')
const organisationModel = require('../models/organisations')

exports.edit_gcses_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/gcses`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/gcses', {
    organisation,
    course,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_gcses_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/gcses`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (!req.session.data.course.acceptPendingGcse) {
    const error = {};
    error.fieldName = "gcse-accept-pending";
    error.href = "#gcse-accept-pending";
    error.text = "Select if you will consider candidates with pending GCSEs";
    errors.push(error);
  } else {
    course.acceptPendingGcse = req.session.data.course.acceptPendingGcse
  }

  if (!req.session.data.course.acceptGcseEquivalency) {
    const error = {};
    error.fieldName = "gcse-accept-equivalency";
    error.href = "#gcse-accept-equivalency";
    error.text = "Select if you will consider candidates who need to take an equivalency test in English, maths or science";
    errors.push(error);
  } else {
    course.acceptGcseEquivalency = req.session.data.course.acceptGcseEquivalency
  }

  if (req.session.data.course.acceptGcseEquivalency && req.session.data.course.acceptGcseEquivalency === 'yes') {
    if (!req.session.data.course.equivalentSubjects) {
      const error = {};
      error.fieldName = "gcse-equivalent-subjects";
      error.href = "#gcse-equivalent-subjects";
      error.text = "Select which subjects will you accept equivalency tests in";
      errors.push(error);
    } else {
      if (req.session.data.course.equivalentSubjects.includes('english')) {
        course.acceptEnglishGcseEquivalency = 'yes'
      }

      if (req.session.data.course.equivalentSubjects.includes('maths')) {
        course.acceptMathsGcseEquivalency = 'yes'
      }

      if (req.session.data.course.equivalentSubjects.includes('science')) {
        course.acceptScienceGcseEquivalency = 'yes'
      }
    }

    if (!req.session.data.course.additionalGcseEquivalencies.length) {
      const error = {};
      error.fieldName = "gcse-equivalent-details";
      error.href = "#gcse-equivalent-details";
      error.text = "Enter details about equivalency tests you offer or accept";
      errors.push(error);
    } else {
      course.additionalGcseEquivalencies = req.session.data.course.additionalGcseEquivalencies
    }
  }

  if (errors.length) {
    res.render('../views/courses/gcses', {
      organisation,
      course,
      actions: {
        save,
        back,
        cancel
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
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}
