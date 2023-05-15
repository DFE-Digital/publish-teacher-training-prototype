const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const studySiteModel = require('../models/study-sites')
const organisationModel = require('../models/organisations')

const courseHelper = require('../helpers/courses')
const cycleHelper = require('../helpers/cycles')
const locationHelper = require('../helpers/locations')
const organisationHelper = require('../helpers/organisations')
const subjectHelper = require('../helpers/subjects')
const utilHelper = require('../helpers/utils')
const visaSponsorshipHelper = require('../helpers/visa-sponsorship')

exports.course_list = (req, res) => {
  // clean out course data
  delete req.session.data.course
  delete req.session.data.degree

  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  const courses = courseModel.findMany({ organisationId: req.params.organisationId, cycleId: req.params.cycleId })

  const relationships = organisation.accreditedBodies

  const groupedCourses = []

  if (relationships && relationships.length) {
    courses.sort((a, b) => {
      return a.accreditedBody.name.localeCompare(b.accreditedBody.name) ||
        a.name.localeCompare(b.name) ||
        a.qualification.localeCompare(b.qualification) ||
        a.studyMode.localeCompare(b.studyMode)
    })

    relationships.forEach((relationship, i) => {
      const group = {}
      group.id = relationship.id
      group.name = relationship.name
      group.courses = courses.filter(course => course.accreditedBody.id === relationship.id)
      groupedCourses.push(group)
    })
  } else {
    courses.sort((a, b) => {
      return a.name.localeCompare(b.name) ||
        a.qualification.localeCompare(b.qualification) ||
        a.studyMode.localeCompare(b.studyMode)
    })
    groupedCourses.push({ courses: courses })
  }

  res.render('../views/courses/list', {
    organisation,
    locations,
    courses: groupedCourses,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      back: '/'
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW COURSE
/// ------------------------------------------------------------------------ ///

exports.course_details = (req, res) => {
  // clean out course data
  delete req.session.data.course
  delete req.session.data.degree

  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })
  const studySites = studySiteModel.findMany({ organisationId: req.params.organisationId })
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

  res.render('../views/courses/details', {
    organisation,
    locations,
    studySites,
    course,
    isCurrentCycle,
    rolledOverCourse,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      preview: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      open: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=details`,
      close: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=details`,
      withdraw: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw?referrer=details`,
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`,
      rollover: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/rollover?referrer=details`
    }
  })
}

exports.course_description = (req, res) => {
  // clean out course data
  delete req.session.data.course
  delete req.session.data.degree

  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })
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

  res.render('../views/courses/description', {
    organisation,
    locations,
    course,
    isCurrentCycle,
    rolledOverCourse,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      preview: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`,
      vacancies: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/vacancies?referrer=description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      open: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=description`,
      close: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=description`,
      withdraw: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw?referrer=description`,
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`,
      rollover: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/rollover?referrer=description`
    }
  })
}

exports.course_preview = (req, res) => {
  let course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course = courseHelper.decorate(course)

  const trainingProvider = organisationModel.findOne({ organisationId: course.trainingProvider.id })

  if (trainingProvider.accreditedBodies) {
    const accreditedBody = trainingProvider.accreditedBodies.find(accreditedBody => accreditedBody.id === course.accreditedBody.id)
    course.aboutAccreditingBody = accreditedBody.description
  }

  res.render('../views/courses/preview/index', {
    course,
    trainingProvider,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// OPEN COURSE
/// ------------------------------------------------------------------------ ///

exports.open_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/open', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=${req.query.referrer}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`
    }
  })
}

exports.open_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/open', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=${req.query.referrer}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`
      },
      errors
    })
  } else {
    const status = { status: 1 }

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: status
    })

    req.flash('success', 'Course opened')

    if (req.query.referrer === 'details') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`)
    }
  }
}

/// ------------------------------------------------------------------------ ///
/// CLOSE COURSE
/// ------------------------------------------------------------------------ ///

exports.close_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/close', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=${req.query.referrer}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`
    }
  })
}

exports.close_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/close', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=${req.query.referrer}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`
      },
      errors
    })
  } else {
    const status = { status: 4 }

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: status
    })

    req.flash('success', 'Course closed')

    if (req.query.referrer === 'details') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`)
    }
  }
}

/// ------------------------------------------------------------------------ ///
/// WITHDRAW COURSE
/// ------------------------------------------------------------------------ ///

exports.withdraw_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/withdraw', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw?referrer=${req.query.referrer}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
      open: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=${req.query.referrer}`,
      close: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=${req.query.referrer}`
    }
  })
}

exports.withdraw_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/withdraw', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw?referrer=${req.query.referrer}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`,
        open: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/open?referrer=${req.query.referrer}`,
        close: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/close?referrer=${req.query.referrer}`
      },
      errors
    })
  } else {
    const status = { status: 3 }

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: status
    })

    req.flash('success', 'Course withdrawn')

    if (req.query.referrer === 'details') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`)
    }
  }
}

/// ------------------------------------------------------------------------ ///
/// ROLLOVER COURSE
/// ------------------------------------------------------------------------ ///

exports.rollover_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/rollover`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer) {
    save += `?referrer=${req.query.referrer}`
    back += `?referrer=${req.query.referrer}`
  }

  if (req.query.referrer === 'details') {
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
  }

  res.render('../views/courses/rollover', {
    course,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.rollover_course_post = (req, res) => {
  courseModel.rollOverOne({
    organisationId: req.params.organisationId,
    courseId: req.params.courseId
  })

  req.flash('success', 'Course rolled over')

  if (req.query.referrer === 'details') {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/${req.query.referrer}`)
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE COURSE
/// ------------------------------------------------------------------------ ///

exports.delete_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/delete', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.delete_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/delete', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    courseModel.deleteOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId
    })

    req.flash('success', 'Course deleted')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`)
  }
}

/// ------------------------------------------------------------------------ ///
/// EDIT COURSE
/// ------------------------------------------------------------------------ ///

exports.edit_course_send_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSend
  if (course && course.isSend) {
    selectedSend = course.isSend
  }

  const sendOptions = courseHelper.getSendOptions(selectedSend)

  res.render('../views/courses/special-educational-needs-disability', {
    course,
    sendOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/special-educational-needs-disability`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_send_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSend
  if (req.session.data.course && req.session.data.course.isSend) {
    selectedSend = req.session.data.course.isSend
  }

  const sendOptions = courseHelper.getSendOptions(selectedSend)

  if (!req.session.data.course.isSend) {
    const error = {}
    error.fieldName = 'send'
    error.href = '#send'
    error.text = 'Select if this is a special educational needs and disability (SEND) course'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/special-educational-needs-disability', {
      course,
      sendOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/special-educational-needs-disability`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'SEND specialism updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_subject_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSubject
  if (course && course.subjects) {
    selectedSubject = []
    selectedSubject.push(course.subjects[0].code)
  }

  let subjectOptions
  if (course.subjectLevel === 'secondary') {
    subjectOptions = subjectHelper.getSubjectSelectOptions(course.subjectLevel, selectedSubject)
  } else {
    subjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSubject)
  }

  let selectedSecondSubject
  if (course && course.subjects) {
    selectedSecondSubject = []
    if (course.subjects.length > 1) {
      // if the first subject is 'ML' then second subject is last item in course subjects
      if (course.subjects[0].code === 'ML') {
        selectedSecondSubject.push(course.subjects[course.subjects.length-1].code)
      }
      // else second subject is the second item in course subjects
      else {
        selectedSecondSubject.push(course.subjects[1].code)
      }
    }
  }

  let secondSubjectOptions
  if (course.subjectLevel === 'secondary') {
    secondSubjectOptions = subjectHelper.getSubjectSelectOptions(course.subjectLevel, selectedSecondSubject)
  } else {
    secondSubjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSecondSubject)
  }

  res.render('../views/courses/subject', {
    course,
    subjectOptions,
    secondSubjectOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_subject_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subjects) {
    selectedSubject = req.session.data.course.subjects
  }

  let subjectOptions
  if (course.subjectLevel === 'secondary') {
    subjectOptions = subjectHelper.getSubjectSelectOptions(course.subjectLevel, selectedSubject)
  } else {
    subjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSubject)
  }

  let selectedSecondSubject
  if (req.session.data.course && req.session.data.course.secondSubject) {
    selectedSecondSubject = req.session.data.course.secondSubject
  }

  let secondSubjectOptions
  if (course.subjectLevel === 'secondary') {
    secondSubjectOptions = subjectHelper.getSubjectSelectOptions(course.subjectLevel, selectedSecondSubject)
  } else {
    secondSubjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSecondSubject)
  }

  if (req.session.data.course.subjectLevel === 'primary') {
    if (!req.session.data.course.subjects) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    }
  } else if (req.session.data.course.subjectLevel === 'secondary') {
    if (req.session.data.course.subjects[0] === '') {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    } else if (req.session.data.course.subjects[0] === req.session.data.course.secondSubject[0]) {
      const error = {}
      error.fieldName = 'second-subject'
      error.href = '#second-subject'
      error.text = 'First subject and second subject cannot be the same'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/subject', {
      course,
      subjectOptions,
      secondSubjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    // if subject is Physics redirect to 'Engineers teach physics' question
    if (selectedSubject.includes('F3')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/campaign?referrer=subject`)
    }

    // if subject is 'Modern languages' redirect to languages question
    else if (selectedSubject.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`)
    }

    // if second subject is 'Modern languages' redirect to languages question
    else if (selectedSecondSubject.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`)
    }

    // else save and return to course details
    else {
      if (req.session.data.course.subjects[0] !== 'F3') {

        let subjectArray = req.session.data.course.subjects

        if (req.session.data.course.secondSubject.length && req.session.data.course.secondSubject[0] !== '') {
          subjectArray = Array.from(
            new Set([
              ...subjectArray,
              ...req.session.data.course.secondSubject
            ])
          )
        }

        req.session.data.course.subjects = subjectArray

        // delete the second subject as no longer needed
        delete req.session.data.course.secondSubject

        req.session.data.course.name = courseHelper.getCourseName(req.session.data.course.subjects)

        courseModel.updateOne({
          organisationId: req.params.organisationId,
          courseId: req.params.courseId,
          course: req.session.data.course
        })

        req.flash('success', 'Subject updated')
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
      }
    }
  }
}

exports.edit_course_modern_language_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSubject
  if (course && course.subjects) {
    selectedSubject = []

    course.subjects.forEach((subject, i) => {
      selectedSubject.push(subject.code)
    })
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions('ML', selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`

  if (req.query.referrer) {
    save += `?referrer=${req.query.referrer}`
  }

  if (req.query?.referrer === 'campaign') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/campaign`
  }

  res.render('../views/courses/modern-languages', {
    course,
    subjectOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_modern_language_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = []

    req.session.data.course.childSubjects.forEach((subjectCode, i) => {
      selectedSubject.push(subjectCode)
    })
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions('ML', selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`

  if (req.query.referrer) {
    save += `?referrer=${req.query.referrer}`
  }

  if (req.query?.referrer === 'campaign') {
    ack = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/campaign`
  }

  if (!req.session.data.course.childSubjects.length) {
    const error = {}
    error.fieldName = 'child-subjects'
    error.href = '#child-subjects'
    error.text = 'Select at least one language'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/modern-languages', {
      course,
      subjectOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {

    let subjectArray = req.session.data.course.subjects

    // if modern languages is first
    if (subjectArray[0] === 'ML') {
      subjectArray = Array.from(
        new Set([
          ...subjectArray,
          ...req.session.data.course.childSubjects
        ])
      )

      if (req.session.data.course.secondSubject.length && req.session.data.course.secondSubject[0] !== '') {
        subjectArray = Array.from(
          new Set([
            ...subjectArray,
            ...req.session.data.course.secondSubject
          ])
        )
      }

    } else {
      if (req.session.data.course.secondSubject.length && req.session.data.course.secondSubject[0] !== '') {
        subjectArray = Array.from(
          new Set([
            ...subjectArray,
            ...req.session.data.course.secondSubject,
            ...req.session.data.course.childSubjects
          ])
        )
      }
    }

    req.session.data.course.subjects = subjectArray

    let courseName = courseHelper.getCourseName(req.session.data.course.subjects)
    // if campaign is 'engineersTeachPhysics' create a ETP course name
    if (req.session.data.course?.campaign === 'engineersTeachPhysics') {
      courseName = courseHelper.getCourseName(req.session.data.course.subjects, req.session.data.course.campaign)
    }

    req.session.data.course.name = courseName

    // delete the child and second subjects as no longer needed
    delete req.session.data.course.childSubjects
    delete req.session.data.course.secondSubject

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    if (req.query.referrer === 'campaign') {
      req.flash('success', 'Subject and Engineers teach physics updated')
    } else {
      req.flash('success', 'Subject updated')
    }

    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_campaign_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedCampaign
  if (course && course.campaign) {
    selectedCampaign = course.campaign
  }

  const campaignOptions = courseHelper.getCampaignOptions(selectedCampaign)

  res.render('../views/courses/campaign', {
    course,
    campaignOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/campaign?referrer=${req.query.referrer}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_campaign_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedCampaign
  if (req.session.data.course && req.session.data.course.campaign) {
    selectedCampaign = req.session.data.course.campaign
  }

  const campaignOptions = courseHelper.getCampaignOptions(selectedCampaign)

  if (!req.session.data.course.campaign) {
    const error = {}
    error.fieldName = 'campaign'
    error.href = '#campaign'
    error.text = 'Select if this course part of the Engineers teach physics programme'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/campaign', {
      course,
      campaignOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/campaign?referrer=${req.query.referrer}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {

    let selectedSecondSubject = []
    if (req.session.data.course?.secondSubject) {
      selectedSecondSubject = req.session.data.course.secondSubject
    }

    // if second subject is ML, redirect to modern languages question
    if (selectedSecondSubject.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language?referrer=campaign`)
    }

    // else save and return to course details
    else {
      let subjectArray = req.session.data.course.subjects

      if (req.session.data.course.secondSubject && req.session.data.course.secondSubject[0] !== '') {
        subjectArray = Array.from(
          new Set([
            ...subjectArray,
            ...req.session.data.course.secondSubject
          ])
        )
      }

      req.session.data.course.subjects = subjectArray

      let courseName = courseHelper.getCourseName(req.session.data.course.subjects, req.session.data.course.campaign)

      req.session.data.course.name = courseName

      courseModel.updateOne({
        organisationId: req.params.organisationId,
        courseId: req.params.courseId,
        course: req.session.data.course
      })

      if (req.query.referrer === 'subject') {
        req.flash('success', 'Subject and Engineers teach physics updated')
      } else {
        req.flash('success', 'Engineers teach physics updated')
      }

      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    }

  }
}

exports.edit_course_age_range_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedAgeRange
  if (course && course.ageRange) {
    selectedAgeRange = course.ageRange
  }

  const ageRangeOptions = courseHelper.getAgeRangeOptions(course.subjectLevel, selectedAgeRange)

  res.render('../views/courses/age-range', {
    course,
    ageRangeOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/age-range`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_age_range_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedAgeRange
  if (req.session.data.course && req.session.data.course.ageRange) {
    selectedAgeRange = req.session.data.course.ageRange
  }

  const ageRangeOptions = courseHelper.getAgeRangeOptions(course.subjectLevel, selectedAgeRange)

  if (!req.session.data.course.ageRange) {
    const error = {}
    error.fieldName = 'age-range'
    error.href = '#age-range'
    error.text = 'Select an age range'
    errors.push(error)
  } else {
    if (req.session.data.course.ageRange === 'other') {
      if (!req.session.data.course.ageRangeOther.from.length) {
        const error = {}
        error.fieldName = 'age-range-other-from'
        error.href = '#age-range-other-from'
        error.text = 'Enter start age'
        errors.push(error)
      } else {
        if (course.subjectLevel === 'primary') {
          if (req.session.data.course.ageRangeOther.from < 3
            || req.session.data.course.ageRangeOther.from > 11) {
            const error = {}
            error.fieldName = 'age-range-other-from'
            error.href = '#age-range-other-from'
            error.text = 'Enter an age between 3 and 11'
            errors.push(error)
          }
        } else {
          if (req.session.data.course.ageRangeOther.from < 11
            || req.session.data.course.ageRangeOther.from > 19) {
            const error = {}
            error.fieldName = 'age-range-other-from'
            error.href = '#age-range-other-from'
            error.text = 'Enter an age between 11 and 19'
            errors.push(error)
          }
        }
      }

      if (!req.session.data.course.ageRangeOther.to.length) {
        const error = {}
        error.fieldName = 'age-range-other-to'
        error.href = '#age-range-other-to'
        error.text = 'Enter end age'
        errors.push(error)
      } else {
        if (course.subjectLevel === 'primary') {
          if (req.session.data.course.ageRangeOther.to < 3
            || req.session.data.course.ageRangeOther.to > 11) {
            const error = {}
            error.fieldName = 'age-range-other-to'
            error.href = '#age-range-other-to'
            error.text = 'Enter an age between 3 and 11'
            errors.push(error)
          }
        } else {
          if (req.session.data.course.ageRangeOther.to < 11
            || req.session.data.course.ageRangeOther.to > 19) {
            const error = {}
            error.fieldName = 'age-range-other-to'
            error.href = '#age-range-other-to'
            error.text = 'Enter an age between 11 and 19'
            errors.push(error)
          }
        }
      }

      if (req.session.data.course.ageRangeOther.from.length
        && req.session.data.course.ageRangeOther.to.length) {

        const startAge = parseInt(req.session.data.course.ageRangeOther.from)
        const endAge = parseInt(req.session.data.course.ageRangeOther.to)

        const ageDiff = endAge - startAge

        if (startAge > endAge) {
          const error = {}
          error.fieldName = 'age-range-other-from'
          error.href = '#age-range-other-from'
          error.text = 'Start age must be less than end age'
          errors.push(error)
        } else if (ageDiff < 4) {
          const error = {}
          error.fieldName = 'age-range-other-to'
          error.href = '#age-range-other-to'
          error.text = 'End age must be at least four years after start age'
          errors.push(error)
        }

      }
    }
  }


  if (errors.length) {
    res.render('../views/courses/age-range', {
      course,
      ageRangeOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/age-range`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Age range updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_qualification_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedQualification
  if (course && course.qualification) {
    selectedQualification = course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(course.subjectLevel, selectedQualification)

  res.render('../views/courses/qualification', {
    course,
    qualificationOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/qualification`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_qualification_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedQualification
  if (req.session.data.course && req.session.data.course.qualification) {
    selectedQualification = req.session.data.course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(course.subjectLevel, selectedQualification)

  if (!req.session.data.course.qualification) {
    const error = {}
    error.fieldName = 'qualification'
    error.href = '#qualification'
    error.text = 'Select a qualification'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/qualification', {
      course,
      qualificationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/qualification`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Qualification updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_funding_type_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedFundingType
  if (course && course.fundingType) {
    selectedFundingType = course.fundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  res.render('../views/courses/funding-type', {
    course,
    fundingTypeOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/funding-type`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_funding_type_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedFundingType
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedFundingType = req.session.data.course.fundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  if (!req.session.data.course.fundingType) {
    const error = {}
    error.fieldName = 'funding-type'
    error.href = '#funding-type'
    error.text = 'Select a funding type'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/funding-type', {
      course,
      fundingTypeOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/funding-type`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    if (course.fundingType === req.session.data.course.fundingType) {
      courseModel.updateOne({
        organisationId: req.params.organisationId,
        courseId: req.params.courseId,
        course: req.session.data.course
      })

      req.flash('success', 'Funding type updated')

      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=funding-type`)
    }
  }
}

exports.edit_course_apprenticeship_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedApprenticeshipOption
  if (course && course.fundingType) {
    selectedApprenticeshipOption = course.fundingType
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  res.render('../views/courses/apprenticeship', {
    course,
    apprenticeshipOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/apprenticeship`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_apprenticeship_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const errors = []

  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedApprenticeshipOption = req.session.data.course.fundingType
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  if (!req.session.data.course.fundingType) {
    const error = {}
    error.fieldName = 'funding-type'
    error.href = '#funding-type'
    error.text = 'Select if this is a teaching apprenticeship'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
      course,
      apprenticeshipOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/apprenticeship`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    if (course.fundingType === req.session.data.course.fundingType) {
      courseModel.updateOne({
        organisationId: req.params.organisationId,
        courseId: req.params.courseId,
        course: req.session.data.course
      })

      req.flash('success', 'Teaching apprenticeship updated')

      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=apprenticeship`)
    }
  }
}

exports.edit_course_study_mode_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedStudyMode
  if (course && course.studyMode) {
    selectedStudyMode = course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  res.render('../views/courses/study-mode', {
    course,
    studyModeOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/study-mode`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_study_mode_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  if (!req.session.data.course.studyMode) {
    const error = {}
    error.fieldName = 'study-mode'
    error.href = '#study-mode'
    error.text = 'Select full time or part time'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/study-mode', {
      course,
      studyModeOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/study-mode`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Full time or part time updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_location_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const selectedLocation = []
  if (course && course.locations) {
    course.locations.forEach((location, i) => {
      selectedLocation.push(location.id)
    })
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  res.render('../views/courses/location', {
    course,
    locationOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placements`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_location_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  if (!req.session.data.course.locations.length) {
    const error = {}
    error.fieldName = 'locations'
    error.href = '#locations'
    error.text = 'Select at least one school placement'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/location', {
      course,
      locationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placements`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'School placements updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_study_site_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const selectedStudySite = []
  if (course && course.studySites) {
    course.studySites.forEach((location, i) => {
      selectedStudySite.push(location.id)
    })
  }

  const studySiteOptions = locationHelper.getStudySiteOptions(req.params.organisationId, selectedStudySite)

  res.render('../views/courses/study-site', {
    course,
    studySiteOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/study-sites`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_study_site_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedStudySite
  if (req.session.data.course && req.session.data.course.studySites) {
    selectedStudySite = req.session.data.course.studySites
  }

  const studySiteOptions = locationHelper.getStudySiteOptions(req.params.organisationId, selectedStudySite)

  if (!req.session.data.course.studySites.length) {
    const error = {}
    error.fieldName = 'study-sites'
    error.href = '#study-sites'
    error.text = 'Select at least one study site'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/study-site', {
      course,
      studySiteOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/study-sites`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Study sites updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_accredited_provider_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedAccreditedBody
  if (course && course.accreditedBody) {
    selectedAccreditedBody = course.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  res.render('../views/courses/accredited-provider', {
    course,
    accreditedBodyOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/accredited-provider`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_accredited_provider_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  if (!req.session.data.course.accreditedBody) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Select an accredited provider'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/accredited-provider', {
      course,
      accreditedBodyOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/accredited-provider`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    if (course.accreditedBody.id === req.session.data.course.accreditedBody) {
      courseModel.updateOne({
        organisationId: req.params.organisationId,
        courseId: req.params.courseId,
        course: req.session.data.course
      })

      req.flash('success', 'Accredited provider updated')

      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=accredited-provider`)
    }
  }
}

exports.edit_course_applications_open_date_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const applicationsOpenDate = cycleHelper.CYCLES[req.params.cycleId].applyOpens

  res.render('../views/courses/applications-open-date', {
    course,
    applicationsOpenDate,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/applications-open-date`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_applications_open_date_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const applicationsOpenDate = cycleHelper.CYCLES[req.params.cycleId].applyOpens

  const errors = []

  if (!req.session.data.course.applicationsOpenDate) {
    const error = {}
    error.fieldName = 'applications-open-date'
    error.href = '#applications-open-date'
    error.text = 'Select an applications open date'
    errors.push(error)
  } else {
    if (req.session.data.course.applicationsOpenDate === 'other' &&
      !req.session.data.course.applicationsOpenDateOther) {
        const error = {}
        error.fieldName = 'applications-open-date-other'
        error.href = '#applications-open-date-other'
        error.text = 'Enter a date when applications will open'
        errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      course,
      applicationsOpenDate,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/applications-open-date`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    // parse the date entered into a date object
    if (req.session.data.course.applicationsOpenDateOther) {
      req.session.data.course.applicationsOpenDateOther = utilHelper.arrayToDateObject(req.session.data.course.applicationsOpenDateOther)
    }

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Date applications open updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_start_date_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedCourseStartDate
  if (course && course.startDate) {
    selectedCourseStartDate = course.startDate
  }

  const courseStartOptions = courseHelper.getCourseStartRadioOptions(selectedCourseStartDate)

  res.render('../views/courses/course-start', {
    course,
    courseStartOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-start`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_start_date_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedCourseStartDate
  if (req.session.data.course && req.session.data.course.startDate) {
    selectedCourseStartDate = req.session.data.course.startDate
  }

  const courseStartOptions = courseHelper.getCourseStartRadioOptions(selectedCourseStartDate)

  if (!req.session.data.course.startDate) {
    const error = {}
    error.fieldName = 'start-date'
    error.href = '#start-date'
    error.text = 'Select a course start date'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/course-start', {
      course,
      courseStartOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-start`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Course start updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_about_course_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const wordCount = 400

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/about-course`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/about-course', {
    course,
    wordCount,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_about_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course.aboutCourse = req.session.data.course.aboutCourse

  const wordCount = 400

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/about-course`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (req.session.data.course.aboutCourse?.split(' ').length > wordCount) {
    const error = {}
    error.fieldName = "about-course"
    error.href = "#about-course"
    error.text = `Course summary must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/about-course', {
      course,
      wordCount,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Course summary updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}

exports.edit_interview_process_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const wordCount = 250

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/interview-process`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/interview-process', {
    course,
    wordCount,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_interview_process_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course.interviewProcess = req.session.data.course.interviewProcess

  const wordCount = 250

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/interview-process`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (req.session.data.course.interviewProcess?.split(' ').length > wordCount) {
    const error = {}
    error.fieldName = "interview-process"
    error.href = "#interview-process"
    error.text = `Interview process must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/interview-process', {
      course,
      wordCount,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Interview process updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}

exports.edit_school_placements_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const wordCount = 350

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placement-details`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/school-placements', {
    course,
    wordCount,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_school_placements_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course.howSchoolPlacementsWork = req.session.data.course.howSchoolPlacementsWork

  const wordCount = 350

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placement-details`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (req.session.data.course.howSchoolPlacementsWork?.split(' ').length > wordCount) {
    const error = {}
    error.fieldName = "school-placements"
    error.href = "#school-placements"
    error.text = `How school placements work must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/school-placements', {
      course,
      wordCount,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'How school placements work updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}

exports.edit_personal_qualities_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/personal-qualities', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/personal-qualities`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_personal_qualities_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/personal-qualities', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/personal-qualities`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Personal qualities updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_other_requirements_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/other-requirements', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/other-requirements`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_other_requirements_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/other-requirements', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/other-requirements`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Other requirements updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_course_length_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedCourseLength
  if (course && course.courseLength) {
    selectedCourseLength = course.courseLength
  }

  const courseLengthOptions = courseHelper.getCourseLengthOptions(selectedCourseLength)

  res.render('../views/courses/course-length', {
    course,
    courseLengthOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-length`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_course_length_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedCourseLength
  if (req.session.data.course && req.session.data.course.courseLength) {
    selectedCourseLength = req.session.data.course.courseLength
  }

  const courseLengthOptions = courseHelper.getCourseLengthOptions(selectedCourseLength)

  if (errors.length) {
    res.render('../views/courses/course-length', {
      course,
      courseLengthOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-length`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Course length updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_course_fees_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-fees`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/course-fees', {
    course,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_course_fees_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-fees`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (errors.length) {
    res.render('../views/courses/course-fees', {
      course,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Course fees updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}

exports.edit_financial_support_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/financial-support', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/financial-support`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_financial_support_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/financial-support', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/financial-support`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Financial support updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_salary_details_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const wordCount = 250

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/salary-details`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  res.render('../views/courses/salary-details', {
    course,
    wordCount,
    actions: {
      save,
      back,
      cancel
    }
  })
}

exports.edit_salary_details_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  course.salaryDetails = req.session.data.course.salaryDetails

  const wordCount = 250

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/salary-details`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
  let cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`

  if (req.query.referrer === 'preview') {
    save += '?referrer=preview'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
    cancel = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`
  }

  const errors = []

  if (req.session.data.course.salaryDetails?.split(' ').length > wordCount) {
    const error = {}
    error.fieldName = "salary-details"
    error.href = "#salary-details"
    error.text = `Salary details must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/salary-details', {
      course,
      wordCount,
      actions: {
        save,
        back,
        cancel
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Salary details updated')
    if (req.query.referrer === 'preview') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/preview`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
    }
  }
}

exports.edit_course_visa_sponsorship_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let fundingType
  if (req.query.referrer === 'funding-type' || req.query.referrer === 'apprenticeship') {
    fundingType = req.session.data.course.fundingType
  } else {
    fundingType = course.fundingType
  }

  let accreditedBody
  if (req.query.referrer === 'accredited-provider') {
    accreditedBody = organisationModel.findOne({ organisationId: req.session.data.course.accreditedBody })
  } else {
    if (course.accreditedBody) {
      accreditedBody = organisationModel.findOne({ organisationId: course.accreditedBody.id })
    } else {
      accreditedBody = organisationModel.findOne({ organisationId: course.trainingProvider.id })
    }
  }

  let selectedVisaOption
  if (fundingType === 'fee') {
    if (req.query.referrer === 'accredited-provider') {
      selectedVisaOption = accreditedBody.visaSponsorship.canSponsorStudentVisa
    } else {
      selectedVisaOption = course.canSponsorStudentVisa || accreditedBody.visaSponsorship.canSponsorStudentVisa
    }
  } else {
    if (organisation.isAccreditedBody) {
      selectedVisaOption = course.canSponsorSkilledWorkerVisa || accreditedBody.visaSponsorship.canSponsorSkilledWorkerVisa
    } else {
      selectedVisaOption = course.canSponsorSkilledWorkerVisa
    }
  }

  let visaOptions = []
  if (fundingType === 'fee') {
    visaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedVisaOption)
  } else {
    visaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedVisaOption)
  }

  res.render('../views/courses/visa-sponsorship', {
    organisation,
    course,
    visaOptions,
    accreditedBody,
    fundingType,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=${req.query.referrer}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_visa_sponsorship_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const errors = []

  let fundingType
  if (req.query.referrer === 'funding-type' || req.query.referrer === 'apprenticeship') {
    fundingType = req.session.data.course.fundingType
  } else {
    fundingType = course.fundingType
  }

  let accreditedBody
  if (req.query.referrer === 'accredited-provider') {
    accreditedBody = organisationModel.findOne({ organisationId: req.session.data.course.accreditedBody })
  } else {
    if (course.accreditedBody) {
      accreditedBody = organisationModel.findOne({ organisationId: course.accreditedBody.id })
    } else {
      accreditedBody = organisationModel.findOne({ organisationId: course.trainingProvider.id })
    }
  }

  let selectedVisaOption
  if (fundingType === 'fee') {
    if (req.query.referrer === 'accredited-provider') {
      selectedVisaOption = accreditedBody.visaSponsorship.canSponsorStudentVisa
    } else {
      selectedVisaOption = course.canSponsorStudentVisa || accreditedBody.visaSponsorship.canSponsorStudentVisa
    }
  } else {
    if (organisation.isAccreditedBody) {
      selectedVisaOption = course.canSponsorSkilledWorkerVisa || accreditedBody.visaSponsorship.canSponsorSkilledWorkerVisa
    } else {
      selectedVisaOption = course.canSponsorSkilledWorkerVisa
    }
  }

  let visaOptions = []
  if (course) {
    if (fundingType === 'fee') {
      visaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedVisaOption)
    } else {
      visaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedVisaOption)
    }
  }

  if (course.fundingType === 'fee') {
    if (!req.session.data.course.canSponsorStudentVisa) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if your organisation can sponsor Student visas for this course'
      errors.push(error)
    }
  }

  if (['salary','apprenticeship'].includes(course.fundingType)) {
    if (!req.session.data.course.canSponsorSkilledWorkerVisa) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if your organisation can sponsor Skilled Worker visas for this course'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/visa-sponsorship', {
      organisation,
      course,
      visaOptions,
      accreditedBody,
      fundingType,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=${req.query.referrer}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    let visa = 'visa sponsorship'
    if (fundingType === 'fee') {
      visa = 'Student visas'
    } else {
      visa = 'Skilled Worker visas'
    }

    if (req.query.referrer === 'funding-type') {
      req.flash('success', `Funding type and ${visa} updated`)
    } else if (req.query.referrer === 'apprenticeship') {
      req.flash('success', `Teaching apprenticeship and ${visa} updated`)
    } else if (req.query.referrer === 'accredited-provider') {
      req.flash('success', `Accredited provider and ${visa} updated`)
    } else {
      req.flash('success', `${visa} updated`)
    }

    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

/// ------------------------------------------------------------------------ ///
/// NEW COURSE
/// ------------------------------------------------------------------------ ///

exports.new_course_get = (req, res) => {
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`)
}

exports.new_course_subject_level_get = (req, res) => {
  let selectedSubjectLevel
  if (req.session.data.course && req.session.data.course.subjectLevel) {
    selectedSubjectLevel = req.session.data.course.subjectLevel
  }

  let selectedSend
  if (req.session.data.course && req.session.data.course.isSend) {
    selectedSend = req.session.data.course.isSend
  }

  const subjectLevelOptions = subjectHelper.getSubjectLevelOptions(selectedSubjectLevel)
  const sendOptions = courseHelper.getSendOptions(selectedSend)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back += '/new/check'
  }

  res.render('../views/courses/subject-level', {
    subjectLevelOptions,
    sendOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_subject_level_post = (req, res) => {
  const errors = []

  if (!req.session.data.course) {
    req.session.data.course = {}
  }

  let selectedSubjectLevel
  if (req.session.data.course && req.session.data.course.subjectLevel) {
    selectedSubjectLevel = req.session.data.course.subjectLevel
  }

  let selectedSend
  if (req.session.data.course && req.session.data.course.isSend) {
    selectedSend = req.session.data.course.isSend
  }

  const subjectLevelOptions = subjectHelper.getSubjectLevelOptions(selectedSubjectLevel)
  const sendOptions = courseHelper.getSendOptions(selectedSend)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back += '/new/check'
  }

  if (!req.session.data.course.subjectLevel) {
    const error = {}
    error.fieldName = 'subject-level'
    error.href = '#subject-level'
    error.text = 'Select a subject level'
    errors.push(error)
  }

  if (!req.session.data.course.isSend) {
    const error = {}
    error.fieldName = 'send'
    error.href = '#send'
    error.text = 'Select if this is a special educational needs and disability (SEND) course'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/subject-level', {
      course: req.session.data.course,
      subjectLevelOptions,
      sendOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.session.data.course.subjectLevel === 'further_education') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`)
    }
  }
}

exports.new_course_subject_get = (req, res) => {
  let selectedSubject
  if (req.session.data.course && req.session.data.course.subjects) {
    selectedSubject = req.session.data.course.subjects
  }

  let subjectOptions
  if (req.session.data.course.subjectLevel === 'secondary') {
    subjectOptions = subjectHelper.getSubjectSelectOptions(req.session.data.course.subjectLevel, selectedSubject)
  } else {
    subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)
  }

  let selectedSecondSubject
  if (req.session.data.course && req.session.data.course.secondSubject) {
    selectedSecondSubject = req.session.data.course.secondSubject
  }

  let secondSubjectOptions
  if (req.session.data.course.subjectLevel === 'secondary') {
    secondSubjectOptions = subjectHelper.getSubjectSelectOptions(req.session.data.course.subjectLevel, selectedSecondSubject)
  } else {
    secondSubjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSecondSubject)
  }

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/subject', {
    course: req.session.data.course,
    subjectOptions,
    secondSubjectOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_subject_post = (req, res) => {
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subjects) {
    selectedSubject = req.session.data.course.subjects
  }

  let subjectOptions
  if (req.session.data.course.subjectLevel === 'secondary') {
    subjectOptions = subjectHelper.getSubjectSelectOptions(req.session.data.course.subjectLevel, selectedSubject)
  } else {
    subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)
  }

  let selectedSecondSubject
  if (req.session.data.course && req.session.data.course.secondSubject) {
    selectedSecondSubject = req.session.data.course.secondSubject
  }

  let secondSubjectOptions
  if (req.session.data.course.subjectLevel === 'secondary') {
    secondSubjectOptions = subjectHelper.getSubjectSelectOptions(req.session.data.course.subjectLevel, selectedSecondSubject)
  } else {
    secondSubjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSecondSubject)
  }

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (req.session.data.course.subjectLevel === 'primary') {
    if (!req.session.data.course.subjects) {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    }
  } else if (req.session.data.course.subjectLevel === 'secondary') {
    if (req.session.data.course.subjects[0] === '') {
      const error = {}
      error.fieldName = 'subject'
      error.href = '#subject'
      error.text = 'Select a subject'
      errors.push(error)
    } else if (req.session.data.course.subjects[0] === req.session.data.course.secondSubject[0]) {
      const error = {}
      error.fieldName = 'second-subject'
      error.href = '#second-subject'
      error.text = 'First subject and second subject cannot be the same'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/subject', {
      course: req.session.data.course,
      subjectOptions,
      secondSubjectOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    let query = ''
    if (req.query.referrer === 'check') {
      query = '?referrer=check'
    }

    if (selectedSubject[0] !== 'F3') {
      delete req.session.data.course.campaign
    }

    if (selectedSubject.includes('ML') || selectedSecondSubject?.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language${query}`)
    } else if (selectedSubject[0] === 'F3') {
      // if first selected subject is physics send to campaign page
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/campaign${query}`)
    } else {
      if (req.query.referrer === 'check') {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
      }
    }
  }
}

exports.new_course_modern_language_get = (req, res) => {
  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = []

    req.session.data.course.childSubjects.forEach((subject, i) => {
      selectedSubject.push(subject)
    })
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions('ML', selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/modern-languages', {
    course: req.session.data.course,
    subjectOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_modern_language_post = (req, res) => {
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = []

    req.session.data.course.childSubjects.forEach((subject, i) => {
      selectedSubject.push(subject)
    })
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions('ML', selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.childSubjects.length) {
    const error = {}
    error.fieldName = 'child-subjects'
    error.href = '#child-subjects'
    error.text = 'Select at least one language'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/modern-languages', {
      course: req.session.data.course,
      subjectOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
    }
  }
}

exports.new_course_campaign_get = (req, res) => {
  let selectedCampaign
  if (req.session.data.course && req.session.data.course.campaign) {
    selectedCampaign = req.session.data.course.campaign
  }

  const campaignOptions = courseHelper.getCampaignOptions(selectedCampaign)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/campaign`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/campaign', {
    course: req.session.data.course,
    campaignOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_campaign_post = (req, res) => {
  const errors = []

  let selectedCampaign
  if (req.session.data.course && req.session.data.course.campaign) {
    selectedCampaign = req.session.data.course.campaign
  }

  const campaignOptions = courseHelper.getCampaignOptions(selectedCampaign)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/campaign`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.campaign) {
    const error = {}
    error.fieldName = 'campaign'
    error.href = '#campaign'
    error.text = 'Select if this course is part of the Engineers teach physics programme'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/campaign', {
      course: req.session.data.course,
      campaignOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
    }
  }
}

exports.new_course_age_range_get = (req, res) => {
  let selectedAgeRange
  if (req.session.data.course && req.session.data.course.ageRange) {
    selectedAgeRange = req.session.data.course.ageRange
  }

  const ageRangeOptions = courseHelper.getAgeRangeOptions(req.session.data.course.subjectLevel, selectedAgeRange)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  } else {
    if (req.session.data.course.childSubjects && req.session.data.course.childSubjects.length) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
    } else if (req.session.data.course.subjects[0] === 'F3') {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/campaign`
    }
  }

  res.render('../views/courses/age-range', {
    course: req.session.data.course,
    ageRangeOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_age_range_post = (req, res) => {
  const errors = []

  let selectedAgeRange
  if (req.session.data.course && req.session.data.course.ageRange) {
    selectedAgeRange = req.session.data.course.ageRange
  }

  const ageRangeOptions = courseHelper.getAgeRangeOptions(req.session.data.course.subjectLevel, selectedAgeRange)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  } else {
    if (req.session.data.course.childSubjects && req.session.data.course.childSubjects.length) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
    } else if (req.session.data.course.subjects[0] === 'F3') {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/campaign`
    }
  }

  if (!req.session.data.course.ageRange) {
    const error = {}
    error.fieldName = 'age-range'
    error.href = '#age-range'
    error.text = 'Select an age range'
    errors.push(error)
  } else {
    if (req.session.data.course.ageRange === 'other') {
      if (!req.session.data.course.ageRangeOther.from.length) {
        const error = {}
        error.fieldName = 'age-range-other-from'
        error.href = '#age-range-other-from'
        error.text = 'Enter start age'
        errors.push(error)
      } else {
        if (req.session.data.course.subjectLevel === 'primary') {
          if (req.session.data.course.ageRangeOther.from < 3
            || req.session.data.course.ageRangeOther.from > 11) {
            const error = {}
            error.fieldName = 'age-range-other-from'
            error.href = '#age-range-other-from'
            error.text = 'Enter an age between 3 and 11'
            errors.push(error)
          }
        } else {
          if (req.session.data.course.ageRangeOther.from < 11
            || req.session.data.course.ageRangeOther.from > 19) {
            const error = {}
            error.fieldName = 'age-range-other-from'
            error.href = '#age-range-other-from'
            error.text = 'Enter an age between 11 and 19'
            errors.push(error)
          }
        }
      }

      if (!req.session.data.course.ageRangeOther.to.length) {
        const error = {}
        error.fieldName = 'age-range-other-to'
        error.href = '#age-range-other-to'
        error.text = 'Enter end age'
        errors.push(error)
      } else {
        if (req.session.data.course.subjectLevel === 'primary') {
          if (req.session.data.course.ageRangeOther.to < 3
            || req.session.data.course.ageRangeOther.to > 11) {
            const error = {}
            error.fieldName = 'age-range-other-to'
            error.href = '#age-range-other-to'
            error.text = 'Enter an age between 3 and 11'
            errors.push(error)
          }
        } else {
          if (req.session.data.course.ageRangeOther.to < 11
            || req.session.data.course.ageRangeOther.to > 19) {
            const error = {}
            error.fieldName = 'age-range-other-to'
            error.href = '#age-range-other-to'
            error.text = 'Enter an age between 11 and 19'
            errors.push(error)
          }
        }
      }

      if (req.session.data.course.ageRangeOther.from.length
        && req.session.data.course.ageRangeOther.to.length) {

        const startAge = parseInt(req.session.data.course.ageRangeOther.from)
        const endAge = parseInt(req.session.data.course.ageRangeOther.to)

        const ageDiff = endAge - startAge

        if (startAge > endAge) {
          const error = {}
          error.fieldName = 'age-range-other-from'
          error.href = '#age-range-other-from'
          error.text = 'Start age must be less than end age'
          errors.push(error)
        } else if (ageDiff < 4) {
          const error = {}
          error.fieldName = 'age-range-other-to'
          error.href = '#age-range-other-to'
          error.text = 'End age must be at least four years after start age'
          errors.push(error)
        }

      }
    }
  }

  if (errors.length) {
    res.render('../views/courses/age-range', {
      course: req.session.data.course,
      ageRangeOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`)
    }
  }
}

exports.new_course_qualification_get = (req, res) => {
  let selectedQualification
  if (req.session.data.course && req.session.data.course.qualification) {
    selectedQualification = req.session.data.course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(req.session.data.course.subjectLevel, selectedQualification)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/qualification', {
    course: req.session.data.course,
    qualificationOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_qualification_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedQualification
  if (req.session.data.course && req.session.data.course.qualification) {
    selectedQualification = req.session.data.course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(req.session.data.course.subjectLevel, selectedQualification)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.qualification) {
    const error = {}
    error.fieldName = 'qualification'
    error.href = '#qualification'
    error.text = 'Select a qualification'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/qualification', {
      course: req.session.data.course,
      qualificationOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      // if organisation is an accredited provider (SCITT or HEI), else they're a lead school
      if (organisation.isAccreditedBody) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`)
      }
    }
  }
}

exports.new_course_funding_type_get = (req, res) => {
  let selectedFundingType
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedFundingType = req.session.data.course.fundingType
  }

  if (req.query.referrer === 'check') {
    // hold funding so we can determine if it has changed
    req.session.data.course.tempFundingType = selectedFundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/funding-type', {
    course: req.session.data.course,
    fundingTypeOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_funding_type_post = (req, res) => {
  const errors = []

  let selectedFundingType
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedFundingType = req.session.data.course.fundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.fundingType) {
    const error = {}
    error.fieldName = 'funding-type'
    error.href = '#funding-type'
    error.text = 'Select a funding type'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/funding-type', {
      course: req.session.data.course,
      fundingTypeOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      if (req.session.data.course.fundingType === req.session.data.course.tempFundingType) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship?referrer=check`)
      }
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
    }
  }
}

exports.new_course_apprenticeship_get = (req, res) => {
  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedApprenticeshipOption = req.session.data.course.fundingType
  }

  if (req.query.referrer === 'check') {
    // hold funding so we can determine if it has changed
    req.session.data.course.tempFundingType = selectedApprenticeshipOption
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/apprenticeship', {
    course: req.session.data.course,
    apprenticeshipOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_apprenticeship_post = (req, res) => {
  const errors = []

  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedApprenticeshipOption = req.session.data.course.fundingType
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.fundingType) {
    const error = {}
    error.fieldName = 'funding-type'
    error.href = '#funding-type'
    error.text = 'Select if this is a teaching apprenticeship'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
      course: req.session.data.course,
      apprenticeshipOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      if (req.session.data.course.fundingType === req.session.data.course.tempFundingType) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship?referrer=check`)
      }
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
    }
  }
}

exports.new_course_study_mode_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`

  if (organisation.isAccreditedBody) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/study-mode', {
    course: req.session.data.course,
    studyModeOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_study_mode_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const errors = []

  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`

  if (organisation.isAccreditedBody) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.studyMode) {
    const error = {}
    error.fieldName = 'study-mode'
    error.href = '#study-mode'
    error.text = 'Select full time or part time'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/study-mode', {
      course: req.session.data.course,
      studyModeOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`)
    }
  }
}

exports.new_course_location_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  // if there's only one location, auto-select and move on
  if (locationOptions.length === 1) {
    req.session.data.course.locations = []
    req.session.data.course.locations.push(locationOptions[0].value)

    if (organisation.isAccreditedBody) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`)
    }
  } else {
    res.render('../views/courses/location', {
      course: req.session.data.course,
      locationOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      }
    })
  }
}

exports.new_course_location_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.locations.length) {
    const error = {}
    error.fieldName = 'locations'
    error.href = '#locations'
    error.text = 'Select at least one school placement'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/location', {
      course: req.session.data.course,
      locationOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      // if (organisation.isAccreditedBody) {
      //   res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
      // } else {
      //   res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`)
      // }
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-sites`)
    }
  }
}

exports.new_course_study_site_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedStudySite
  if (req.session.data.course && req.session.data.course.studySites) {
    selectedStudySite = req.session.data.course.studySites
  }

  const studySiteOptions = locationHelper.getStudySiteOptions(req.params.organisationId, selectedStudySite)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-sites`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  // if there's only one location, auto-select and move on
  if (studySiteOptions.length === 1) {
    req.session.data.course.studySites = []
    req.session.data.course.studySites.push(studySiteOptions[0].value)

    if (organisation.isAccreditedBody) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`)
    }
  } else {
    res.render('../views/courses/study-site', {
      course: req.session.data.course,
      studySiteOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      }
    })
  }
}

exports.new_course_study_site_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedStudySite
  if (req.session.data.course && req.session.data.course.studySites) {
    selectedStudySite = req.session.data.course.studySites
  }

  const studySiteOptions = locationHelper.getStudySiteOptions(req.params.organisationId, selectedStudySite)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-sites`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.studySites.length) {
    const error = {}
    error.fieldName = 'study-sites'
    error.href = '#study-sites'
    error.text = 'Select at least one study site'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/study-site', {
      course: req.session.data.course,
      studySiteOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      if (organisation.isAccreditedBody) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`)
      }
    }
  }
}

exports.new_course_accredited_provider_get = (req, res) => {
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  if (req.query.referrer === 'check') {
    // hold accredited provider so we can determine if it has changed
    req.session.data.course.tempAccreditedBody = selectedAccreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-sites`

  if (locations.length === 1) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }
  // if there's only one accredited provider, auto-select and move on
  if (accreditedBodyOptions.length === 1) {
    req.session.data.course.accreditedBody = accreditedBodyOptions[0].value
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
  } else {
    res.render('../views/courses/accredited-provider', {
      course: req.session.data.course,
      accreditedBodyOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      }
    })
  }
}

exports.new_course_accredited_provider_post = (req, res) => {
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  const errors = []

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-sites`

  if (locations.length === 1) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.accreditedBody) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Select an accredited provider'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/accredited-provider', {
      course: req.session.data.course,
      accreditedBodyOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    // TODO: if (organisation.type === 'scitt' && fundingType === 'fee') skip visa question and default to 'no'
    if (req.query.referrer === 'check') {
      if (req.session.data.course.accreditedBody === req.session.data.course.tempAccreditedBody) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
      } else {
        // TODO: delete the student visa choice so it defaults to the accredited provider's answer?
        // delete req.session.data.course.canSponsorStudentVisa
        // do we need to delete the Skilled Worker visa?
        // delete req.session.data.course.canSponsorSkilledWorkerVisa
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship?referrer=check`)
      }
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
    }
  }
}

exports.new_course_visa_sponsorship_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  let accreditedBody
  if (req.session.data.course.accreditedBody) {
    accreditedBody = organisationModel.findOne({ organisationId: req.session.data.course.accreditedBody })
  } else {
    accreditedBody = organisationModel.findOne({ organisationId: req.params.organisationId })
  }

  let selectedVisaOption
  if (req.session.data.course) {
    if (req.session.data.course.fundingType === 'fee') {
      selectedVisaOption = req.session.data.course.canSponsorStudentVisa || accreditedBody.visaSponsorship.canSponsorStudentVisa
    } else {
      if (organisation.isAccreditedBody) {
        selectedVisaOption = req.session.data.course.canSponsorSkilledWorkerVisa || accreditedBody.visaSponsorship.canSponsorSkilledWorkerVisa
      } else {
        selectedVisaOption = req.session.data.course.canSponsorSkilledWorkerVisa
      }
    }
  }

  let visaOptions = []
  if (req.session.data.course.fundingType === 'fee') {
    visaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedVisaOption)
  } else {
    visaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedVisaOption)
  }

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`

  if (organisation.isAccreditedBody) {
    if (locations.length > 1) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
    } else {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
    }
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/visa-sponsorship', {
    organisation,
    course: req.session.data.course,
    visaOptions,
    accreditedBody,
    fundingType: req.session.data.course.fundingType,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_visa_sponsorship_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  let accreditedBody
  if (req.session.data.course.accreditedBody) {
    accreditedBody = organisationModel.findOne({ organisationId: req.session.data.course.accreditedBody })
  } else {
    accreditedBody = organisationModel.findOne({ organisationId: req.params.organisationId })
  }

  const errors = []

  let selectedVisaOption
  if (req.session.data.course) {
    if (req.session.data.course.fundingType === 'fee') {
      selectedVisaOption = req.session.data.course.canSponsorStudentVisa
    } else {
      selectedVisaOption = req.session.data.course.canSponsorSkilledWorkerVisa
    }
  }

  let visaOptions = []
  if (req.session.data.course) {
    if (req.session.data.course.fundingType === 'fee') {
      visaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedVisaOption)
    } else {
      visaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedVisaOption)
    }
  }

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-provider`

  if (organisation.isAccreditedBody) {
    if (locations.length > 1) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/school-placements`
    } else {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
    }
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (req.session.data.course.fundingType === 'fee') {
    if (!req.session.data.course.canSponsorStudentVisa) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if your organisation can sponsor Student visas for this course'
      errors.push(error)
    }
  }

  if (['salary','apprenticeship'].includes(req.session.data.course.fundingType)) {
    if (!req.session.data.course.canSponsorSkilledWorkerVisa) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if your organisation can sponsor Skilled Worker visas for this course'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/visa-sponsorship', {
      organisation,
      course: req.session.data.course,
      visaOptions,
      accreditedBody,
      fundingType: req.session.data.course.fundingType,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`)
    }
  }
}

exports.new_course_applications_open_date_get = (req, res) => {
  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  const applicationsOpenDate = cycleHelper.CYCLES[req.params.cycleId].applyOpens

  res.render('../views/courses/applications-open-date', {
    course: req.session.data.course,
    applicationsOpenDate,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_applications_open_date_post = (req, res) => {
  const errors = []

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  const applicationsOpenDate = cycleHelper.CYCLES[req.params.cycleId].applyOpens

  if (!req.session.data.course.applicationsOpenDate) {
    const error = {}
    error.fieldName = 'applications-open-date'
    error.href = '#applications-open-date'
    error.text = 'Select an applications open date'
    errors.push(error)
  } else {
    if (req.session.data.course.applicationsOpenDate === 'other' &&
      !req.session.data.course.applicationsOpenDateOther) {
        const error = {}
        error.fieldName = 'applications-open-date-other'
        error.href = '#applications-open-date-other'
        error.text = 'Enter a date when applications will open'
        errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      course: req.session.data.course,
      applicationsOpenDate,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    // parse the date entered into a date object
    if (req.session.data.course.applicationsOpenDateOther) {
      req.session.data.course.applicationsOpenDateOther = utilHelper.arrayToDateObject(req.session.data.course.applicationsOpenDateOther)
    }

    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`)
    }
  }
}

exports.new_course_start_date_get = (req, res) => {
  let selectedCourseStartDate
  if (req.session.data.course && req.session.data.course.startDate) {
    selectedCourseStartDate = req.session.data.course.startDate
  }

  const courseStartOptions = courseHelper.getCourseStartRadioOptions(selectedCourseStartDate)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/course-start', {
    course: req.session.data.course,
    courseStartOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_start_date_post = (req, res) => {
  const errors = []

  let selectedCourseStartDate
  if (req.session.data.course && req.session.data.course.startDate) {
    selectedCourseStartDate = req.session.data.course.startDate
  }

  const courseStartOptions = courseHelper.getCourseStartRadioOptions(selectedCourseStartDate)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (!req.session.data.course.startDate) {
    const error = {}
    error.fieldName = 'start-date'
    error.href = '#start-date'
    error.text = 'Select a course start date'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/courses/course-start', {
      course: req.session.data.course,
      courseStartOptions,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
  }
}

exports.new_course_check_answers_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })
  const studySites = studySiteModel.findMany({ organisationId: req.params.organisationId })
  const course = req.session.data.course

  let subjectArray = course.subjects

  if (course.subjects[0] === 'ML') {
    subjectArray = Array.from(
      new Set([
        ...subjectArray,
        ...course.childSubjects
      ])
    )
  }

  if (course.secondSubject) {
    if (course.secondSubject[0] !== '') {
      subjectArray = Array.from(
        new Set([
          ...subjectArray,
          ...course.secondSubject
        ])
      )
    }

    if (course.secondSubject[0] === 'ML') {
      subjectArray = Array.from(
        new Set([
          ...subjectArray,
          ...course.childSubjects
        ])
      )
    }
  }

  course.subjectArray = subjectArray

  // remove temporary data as no longer needed
  delete req.session.data.course.tempFundingType
  delete req.session.data.course.tempAccreditedBody

  res.render('../views/courses/check-your-answers', {
    organisation,
    locations,
    studySites,
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`
    }
  })
}

exports.new_course_check_answers_post = (req, res) => {
  let subjectArray = req.session.data.course.subjects

  if (req.session.data.course.subjects[0] === 'ML') {
    subjectArray = Array.from(
      new Set([
        ...subjectArray,
        ...req.session.data.course.childSubjects
      ])
    )
  }

  if (req.session.data.course.secondSubject) {
    if (req.session.data.course.secondSubject[0] !== '') {
      subjectArray = Array.from(
        new Set([
          ...subjectArray,
          ...req.session.data.course.secondSubject
        ])
      )
    }

    if (req.session.data.course.secondSubject[0] === 'ML') {
      subjectArray = Array.from(
        new Set([
          ...subjectArray,
          ...req.session.data.course.childSubjects
        ])
      )
    }
  }

  req.session.data.course.subjects = subjectArray

  // delete the child subjects as no longer needed
  delete req.session.data.course.childSubjects
  delete req.session.data.course.secondSubject

  // create the course name based on the subjects chosen
  if (req.session.data.course.subjectLevel === 'further_education') {
    req.session.data.course.name = 'Further education'
  } else {
    req.session.data.course.name = courseHelper.getCourseName(req.session.data.course.subjects, req.session.data.course.campaign)
  }

  // create a random course 4-digit alphanumeric code for the course
  req.session.data.course.code = courseHelper.createCourseCode()

  courseModel.insertOne({
    organisationId: req.params.organisationId,
    cycleId: req.params.cycleId,
    course: req.session.data.course
  })

  // delete the course data as no longer needed
  delete req.session.data.course

  req.flash('success', 'Course added')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`)
}
