const courseModel = require('../models/courses')
const degreeModel = require('../models/degrees')
const organisationModel = require('../models/organisations')

const degreeHelper = require('../helpers/degrees')

exports.edit_degree_minimum_classification_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  let selectedMinimumDegreeGrade
  if (req.session.data.degree && req.session.data.degree.minimum) {
    selectedMinimumDegreeGrade = req.session.data.degree.minimum
  } else {
    if (['1','2','3'].includes(course.degreeGrade)) {
      selectedMinimumDegreeGrade = 'yes'
    } else if (course.degreeGrade === '9') {
      selectedMinimumDegreeGrade = 'no'
    }
  }

  const minimumDegreeGradeOptions = degreeHelper.getMinimumDegreeGradeOptions(selectedMinimumDegreeGrade)

  res.render('../views/courses/degree/minimum', {
    organisation,
    course,
    minimumDegreeGradeOptions,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_degree_minimum_classification_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  let selectedMinimumDegreeGrade
  if (req.session.data.degree && req.session.data.degree.minimum) {
    selectedMinimumDegreeGrade = req.session.data.degree.minimum
  }

  const minimumDegreeGradeOptions = degreeHelper.getMinimumDegreeGradeOptions(selectedMinimumDegreeGrade)

  const errors = []

  if (errors.length) {
    res.render('../views/courses/degree/minimum', {
      organisation,
      course,
      minimumDegreeGradeOptions,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {

    // if no additional requirements save degreeGrade as 9, otherwise move on to next step
    if (req.session.data.degree && req.session.data.degree.minimum === 'yes') {
      let next = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/classification`

      if (req.query.referrer === 'preview') {
        next += '?referrer=preview'
      }

      res.redirect(next)
    } else {
      degreeModel.updateOne({
        organisationId: req.params.organisationId,
        courseId: req.params.courseId,
        degree: {
          grade: '9'
        }
      })

      delete req.session.data.degree

      req.flash('success', 'Degree updated')
      if (req.query.referrer === 'preview') {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
      }
    }
  }
}

exports.edit_degree_classification_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/classification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back += '?referrer=preview'
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  let selectedDegreeGrade
  if (req.session.data.degree && req.session.data.degree.grade) {
    selectedDegreeGrade = req.session.data.degree.grade
  } else {
    selectedDegreeGrade = course.degreeGrade
  }

  const degreeGradeOptions = degreeHelper.getDegreeGradeOptions(selectedDegreeGrade)

  res.render('../views/courses/degree/classification', {
    organisation,
    course,
    degreeGradeOptions,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_degree_classification_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/classification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back += '?referrer=preview'
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  let selectedDegreeGrade
  if (req.session.data.degree && req.session.data.degree.grade) {
    selectedDegreeGrade = req.session.data.degree.grade
  } else {
    selectedDegreeGrade = course.degreeGrade
  }

  const degreeGradeOptions = degreeHelper.getDegreeGradeOptions(selectedDegreeGrade)

  const errors = []

  if (errors.length) {
    res.render('../views/courses/degree/classification', {
      organisation,
      course,
      degreeGradeOptions,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    let next = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/subject-requirements`

    if (req.query.referrer === 'preview') {
      next += '?referrer=preview'
    }

    res.redirect(next)
  }

}

exports.edit_degree_subject_requirements_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/subject-requirements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/classification`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back += '?referrer=preview'
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/degree/requirements', {
    organisation,
    course,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_degree_subject_requirements_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course.additionalDegreeSubjectRequirements = req.session.data.degree.requirements

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/subject-requirements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/degree/classification`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back += '?referrer=preview'
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (errors.length) {
    res.render('../views/courses/degree/requirements', {
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
    degreeModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      degree: req.session.data.degree
    })

    delete req.session.data.degree

    req.flash('success', 'Degree updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }

}
