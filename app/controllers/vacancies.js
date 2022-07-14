const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const organisationModel = require('../models/organisations')

const courseHelper = require('../helpers/courses')
const cycleHelper = require('../helpers/cycles')
const locationHelper = require('../helpers/locations')

exports.vacancy_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
  if (req.query.referrer === 'description') {
    back += '/description'
  }

  res.render('../views/vacancies/show', {
    organisation,
    course,
    actions: {
      back,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`
    }
  })
}

exports.edit_vacancies_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const selectedLocation = []
  if (course && course.locations) {
    course.locations.forEach((location, i) => {
      selectedLocation.push(location.id)
    })
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  res.render('../views/vacancies/edit', {
    organisation,
    course,
    locationOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.edit_vacancies_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  const errors = []

  if (errors.length) {
    res.render('../views/vacancies/edit', {
      organisation,
      course,
      locationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
      }
    })
  } else {

    req.flash('success', 'Vacancies updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`);
  }
}
