const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const vacancyModel = require('../models/vacancies')

const courseHelper = require('../helpers/courses')
const cycleHelper = require('../helpers/cycles')
const vacancyHelper = require('../helpers/vacancies')

exports.vacancy_details = (req, res) => {
  delete req.session.data.course
  delete req.session.data.locations

  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const isCurrentCycle = req.params.cycleId === cycleHelper.CURRENT_CYCLE.code

  let rolledOverCourse
  if (process.env.IS_ROLLOVER) {
    rolledOverCourse = courseModel.findMany({
      organisationId: req.params.organisationId,
      cycleId: cycleHelper.NEXT_CYCLE.code,
      courseCode: course.code
    })[0]
  }

  const selectedLocation = []
  if (course && course.locations) {
    course.locations.forEach((location, i) => {
      if (['F','P','B'].includes(location.vacancies)) {
        selectedLocation.push(location.id)
      }
    })

    if (selectedLocation.length) {
      course.hasVacancies = 'yes'
    } else {
      course.hasVacancies = 'no'
    }
  } else {
    course.hasVacancies = 'no'
  }

  const locationOptions = vacancyHelper.getLocationOptions(req.params.organisationId, req.params.courseId, selectedLocation)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
  if (req.query.referrer === 'description') {
    back += '/description'
  } else if (req.query.referrer === 'list') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
  }

  res.render('../views/courses/vacancies/show', {
    course,
    locationOptions,
    isCurrentCycle,
    rolledOverCourse,
    actions: {
      back,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      preview: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies?referrer=description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`,
      rollover: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/rollover?referrer=vacancies`
    }
  })
}

exports.edit_vacancies_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  if (req.session.data.course?.hasVacancies !== undefined) {
    course.hasVacancies = req.session.data.course.hasVacancies
  } else {
    course.hasVacancies = courseHelper.hasVacancies(course.locations) ? 'yes' : 'no'
  }

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`
  }

  res.render('../views/courses/vacancies/edit', {
    course,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.edit_vacancies_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  // replace the course data with submitted data
  course.hasVacancies = req.session.data.course.hasVacancies

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = vacancyHelper.getLocationOptions(req.params.organisationId, req.params.courseId, selectedLocation)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`
  }

  const errors = []

  // if (course.hasVacancies === 'yes' && req.session.data.locations.vacancies === undefined) {
  //   const error = {}
  //   error.fieldName = "locations-vacancies"
  //   error.href = "#locations-vacancies"
  //   error.text = "Select which locations have vacancies"
  //   errors.push(error)
  // }

  if (errors.length) {
    res.render('../views/courses/vacancies/edit', {
      course,
      locationOptions,
      errors,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
      }
    })
  } else {
    if (course.hasVacancies === 'yes') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/school-placements`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`)
    }
  }
}

exports.edit_vacancies_locations_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedLocation = []
  if (req.session.data.locations?.vacancies) {
    selectedLocation = req.session.data.locations.vacancies
  } else {
    if (course && course.locations) {
      course.locations.forEach((location, i) => {
        if (['F','P','B'].includes(location.vacancies)) {
          selectedLocation.push(location.id)
        }
      })
    }
  }

  const locationOptions = vacancyHelper.getLocationOptions(req.params.organisationId, req.params.courseId, selectedLocation)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/school-placements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`
  }

  res.render('../views/courses/vacancies/locations', {
    course,
    locationOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.edit_vacancies_locations_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const locationOptions = vacancyHelper.getLocationOptions(
    req.params.organisationId,
    req.params.courseId,
    req.session.data.locations.vacancies)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/school-placements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`
  }

  const errors = []

  if (req.session.data.locations.vacancies === undefined) {
    const error = {}
      error.fieldName = "locations-vacancies"
      error.href = "#locations-vacancies"
      error.text = "Select all school placements with vacancies"
      errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/vacancies/locations', {
      course,
      locationOptions,
      errors,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
      }
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`)
  }

}

exports.edit_vacancies_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  if (req.session.data.course?.hasVacancies !== undefined) {
    course.hasVacancies = req.session.data.course.hasVacancies
  }

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/school-placements`
  if (course.hasVacancies === 'no') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/edit`
  }

  res.render('../views/courses/vacancies/check-your-answers', {
    organisation,
    course,
    locations: req.session.data.locations,
    actions: {
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`,
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies/check`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`
    }
  })
}

exports.edit_vacancies_check_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  // replace the course data with submitted data
  course.hasVacancies = req.session.data.course.hasVacancies

  if (course.hasVacancies === 'yes') {
    vacancyModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      locations: req.session.data.locations
    })
  } else {
    vacancyModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      locations: {}
    })
  }

  req.flash('success', 'Vacancies updated')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`)
}
