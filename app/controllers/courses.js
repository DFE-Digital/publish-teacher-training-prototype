const courseModel = require('../models/courses')
const locationModel = require('../models/locations')
const organisationModel = require('../models/organisations')

const courseHelper = require('../helpers/courses')
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
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/details', {
    organisation,
    locations,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      withdraw: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw`,
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`
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

  res.render('../views/courses/description', {
    organisation,
    locations,
    course,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      withdraw: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw`,
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/delete`
    }
  })
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

    course.subjects.forEach((subject, i) => {
      selectedSubject.push(subject.code)
    })
  }

  let subjectOptions
  if (course.subjectLevel === 'secondary') {
    subjectOptions = subjectHelper.getSubjectSelectOptions(course.subjectLevel, selectedSubject)
  } else {
    subjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSubject)
  }

  res.render('../views/courses/subject', {
    course,
    subjectOptions,
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

  if (errors.length) {
    res.render('../views/courses/subject', {
      course,
      subjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    if (selectedSubject.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`)
    } else {
      req.session.data.course.name = courseHelper.createCourseName(req.session.data.course.subjects)

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

  res.render('../views/courses/modern-languages', {
    course,
    subjectOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_modern_language_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subjects) {
    selectedSubject = []

    req.session.data.course.subjects.forEach((subject, i) => {
      selectedSubject.push(subject.code)
    })
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions('ML', selectedSubject)

  if (errors.length) {
    res.render('../views/courses/modern-languages', {
      course,
      subjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/subject`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    // combine parent and child subjects
    req.session.data.course.subjects = [...req.session.data.course.subjects, ...req.session.data.course.childSubjects]

    // delete the child subjects as no longer needed
    delete req.session.data.course.childSubjects

    req.session.data.course.name = courseHelper.createCourseName(req.session.data.course.subjects)

    courseModel.updateOne({
      organisationId: req.params.organisationId,
      courseId: req.params.courseId,
      course: req.session.data.course
    })

    req.flash('success', 'Subject updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/location`,
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

  if (errors.length) {
    res.render('../views/courses/location', {
      course,
      locationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/location`,
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

    req.flash('success', 'Location updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_accredited_body_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedAccreditedBody
  if (course && course.accreditedBody) {
    selectedAccreditedBody = course.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  res.render('../views/courses/accredited-body', {
    course,
    accreditedBodyOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/accredited-body`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_accredited_body_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      course,
      accreditedBodyOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/accredited-body`,
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

      req.flash('success', 'Accredited body updated')

      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/visa-sponsorship?referrer=accredited-body`)
    }
  }
}

exports.edit_course_applications_open_date_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/applications-open-date', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/applications-open-date`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_applications_open_date_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      course,
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

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStartDate)

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

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStartDate)

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

  res.render('../views/courses/about-course', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/about-course`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_about_course_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/about-course', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/about-course`,
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

    req.flash('success', 'About this course updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_interview_process_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/interview-process', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/interview-process`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_interview_process_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/interview-process', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/interview-process`,
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

    req.flash('success', 'Interview process updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
  }
}

exports.edit_school_placements_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/school-placements', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placements`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_school_placements_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/school-placements', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/school-placements`,
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

    req.flash('success', 'How school placements work updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
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

  res.render('../views/courses/course-fees', {
    course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-fees`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
    }
  })
}

exports.edit_course_fees_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  if (errors.length) {
    res.render('../views/courses/course-fees', {
      course,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/course-fees`,
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

    req.flash('success', 'Course fees updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
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
  if (req.query.referrer === 'accredited-body') {
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
    if (req.query.referrer === 'accredited-body') {
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
  if (req.query.referrer === 'accredited-body') {
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
    if (req.query.referrer === 'accredited-body') {
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

  if (!req.session.data.course) {
    if (course.fundingType === 'fee') {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if candidates can get a sponsored Student visa'
      errors.push(error)
    }

    if (course.fundingType === 'salary') {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if candidates can get a sponsored Skilled Worker visa'
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
      visa = 'Student visa'
    } else {
      visa = 'Skilled Worker visa'
    }

    if (req.query.referrer === 'funding-type') {
      req.flash('success', `Funding type and ${visa} updated`)
    } else if (req.query.referrer === 'apprenticeship') {
      req.flash('success', `Teaching apprenticeship and ${visa} updated`)
    } else if (req.query.referrer === 'accredited-body') {
      req.flash('success', `Accredited body and ${visa} updated`)
    } else {
      req.flash('success', `${visa} updated`)
    }

    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
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
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/withdraw`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`
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
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`)
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

  if (req.session.data.course.subjects[0] === '') {
    const error = {}
    error.fieldName = 'subject'
    error.href = '#subject'
    error.text = 'Select a subject'
    errors.push(error)
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
    if (selectedSubject.includes('ML')) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
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
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
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
      // if organisation is an accredited body (SCITT or HEI), else they're a lead school
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
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`)
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
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
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`)
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
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
      if (organisation.isAccreditedBody) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`)
      }
    }
  }
}

exports.new_course_accredited_body_get = (req, res) => {
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  if (req.query.referrer === 'check') {
    // hold accredited body so we can determine if it has changed
    req.session.data.course.tempAccreditedBody = selectedAccreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`

  if (locations.length === 1) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }
  // if there's only one accredited body, auto-select and move on
  if (accreditedBodyOptions.length === 1) {
    req.session.data.course.accreditedBody = accreditedBodyOptions[0].value
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/visa-sponsorship`)
  } else {
    res.render('../views/courses/accredited-body', {
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

exports.new_course_accredited_body_post = (req, res) => {
  const locations = locationModel.findMany({ organisationId: req.params.organisationId })

  const errors = []

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`

  if (locations.length === 1) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
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
        // TODO: delete the student visa choice so it defaults to the accredited body's answer?
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

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`

  if (organisation.isAccreditedBody) {
    if (locations.length > 1) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
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

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`

  if (organisation.isAccreditedBody) {
    if (locations.length > 1) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
    } else {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
    }
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (req.session.data.course.fundingType === 'fee') {
    if (req.session.data.course.canSponsorStudentVisa === undefined) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if candidates can get a sponsored Student visa'
      errors.push(error)
    }
  }

  if (req.session.data.course.fundingType === 'salary') {
    if (req.session.data.course.canSponsorSkilledWorkerVisa === undefined) {
      const error = {}
      error.fieldName = 'visa-sponsorship'
      error.href = '#visa-sponsorship'
      error.text = 'Select if candidates can get a sponsored Skilled Worker visa'
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

  res.render('../views/courses/applications-open-date', {
    course: req.session.data.course,
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

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      course: req.session.data.course,
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

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStartDate)

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

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStartDate)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
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

  // remove temporary data as no longer needed
  delete req.session.data.course.tempFundingType
  delete req.session.data.course.tempAccreditedBody

  res.render('../views/courses/check-your-answers', {
    organisation,
    locations,
    course: req.session.data.course,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`
    }
  })
}

exports.new_course_check_answers_post = (req, res) => {
  // combine parent and child subjects
  if (req.session.data.course.childSubjects) {
    req.session.data.course.subjects = [...req.session.data.course.subjects, ...req.session.data.course.childSubjects]

    // delete the child subjects as no longer needed
    delete req.session.data.course.childSubjects
  }

  // create the course name based on the subjects chosen
  if (req.session.data.course.subjectLevel === 'further_education') {
    req.session.data.course.name = 'Further education'
  } else {
    req.session.data.course.name = courseHelper.createCourseName(req.session.data.course.subjects)
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
