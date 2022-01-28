const courseModel = require('../models/courses')
const courseHelper = require('../helpers/courses')

const locationHelper = require('../helpers/locations')
const organisationHelper = require('../helpers/organisations')
const subjectHelper = require('../helpers/subjects')

exports.course_list = (req, res) => {
  // clean out course data
  delete req.session.data.course
  res.render('../views/courses/list', {
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW COURSE
/// ------------------------------------------------------------------------ ///

exports.course_details = (req, res) => {
  res.send('NOT IMPLEMENTED: Course detail: ' + req.params.courseId)
}

exports.course_description = (req, res) => {
  res.send('NOT IMPLEMENTED: Course description: ' + req.params.courseId)
}

/// ------------------------------------------------------------------------ ///
/// EDIT COURSE
/// ------------------------------------------------------------------------ ///

/// ------------------------------------------------------------------------ ///
/// NEW COURSE
/// ------------------------------------------------------------------------ ///

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
  const sendOptions = subjectHelper.getSendOptions(selectedSend)

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
  if (req.query.referrer === 'check') {
    back += '/new/check'
  }

  res.render('../views/courses/subject-level', {
    subjectLevelOptions,
    sendOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      back: back,
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
  const sendOptions = subjectHelper.getSendOptions(selectedSend)

  if (errors.length) {
    res.render('../views/courses/subject-level', {
      subjectLevelOptions,
      sendOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`)
  }
}

exports.new_course_subject_get = (req, res) => {
  let selectedSubject
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)

  res.render('../views/courses/subject', {
    subjectOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_subject_post = (req, res) => {
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)

  if (errors.length) {
    res.render('../views/courses/subject', {
      subjectOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (selectedSubject === 'ML') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
    }
  }
}

exports.new_course_modern_language_get = (req, res) => {
  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubject) {
    selectedSubject = req.session.data.course.childSubject
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions(req.session.data.course.subject, selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/modern-languages', {
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
  if (req.session.data.course && req.session.data.course.childSubject) {
    selectedSubject = req.session.data.course.childSubject
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions(req.session.data.course.subject, selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/modern-languages', {
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
    if (req.session.data.course.childSubject && req.session.data.course.childSubject.length) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
    }
  }

  res.render('../views/courses/age-range', {
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
    if (req.session.data.course.childSubject && req.session.data.course.childSubject.length) {
      back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/modern-language`
    }
  }

  if (errors.length) {
    res.render('../views/courses/age-range', {
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

  res.render('../views/courses/qualification', {
    qualificationOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_qualification_post = (req, res) => {
  const errors = []

  let selectedQualification
  if (req.session.data.course && req.session.data.course.qualification) {
    selectedQualification = req.session.data.course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(req.session.data.course.subjectLevel, selectedQualification)

  if (errors.length) {
    res.render('../views/courses/qualification', {
      qualificationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      // TODO: if organisation is a lead school else scitt/hei
      if (true) {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`)
      } else {
        res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`)
      }
    }
  }
}

exports.new_course_funding_type_get = (req, res) => {
  let selectedFundingType
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedFundingType = req.session.data.course.fundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  res.render('../views/courses/funding-type', {
    fundingTypeOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
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

  if (errors.length) {
    res.render('../views/courses/funding-type', {
      fundingTypeOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
    }
  }
}

exports.new_course_apprenticeship_get = (req, res) => {
  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.apprenticeship) {
    selectedApprenticeshipOption = req.session.data.course.apprenticeship
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  res.render('../views/courses/apprenticeship', {
    apprenticeshipOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_apprenticeship_post = (req, res) => {
  const errors = []

  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.apprenticeship) {
    selectedApprenticeshipOption = req.session.data.course.apprenticeship
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
      apprenticeshipOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
    }
  }
}

exports.new_course_study_mode_get = (req, res) => {
  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  let back = ''
  // TODO: if organisation is a lead school else scitt
  if (true) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  } else {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  res.render('../views/courses/study-mode', {
    studyModeOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
      back: back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_study_mode_post = (req, res) => {
  const errors = []

  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  let back = ''
  // TODO: if organisation is a lead school else scitt
  if (true) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  } else {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (errors.length) {
    res.render('../views/courses/study-mode', {
      studyModeOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
        back: back,
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
  let selectedLocation
  if (req.session.data.course && req.session.data.course.location) {
    selectedLocation = req.session.data.course.location
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  res.render('../views/courses/location', {
    locationOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_location_post = (req, res) => {
  const errors = []

  let selectedLocation
  if (req.session.data.course && req.session.data.course.location) {
    selectedLocation = req.session.data.course.location
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  if (errors.length) {
    res.render('../views/courses/location', {
      locationOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`)
    }
  }
}

exports.new_course_accredited_body_get = (req, res) => {
  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = courseHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let selectedAccreditedBodyOther
  if (req.session.data.course && req.session.data.course.accreditedBodyOther) {
    selectedAccreditedBodyOther = req.session.data.course.accreditedBodyOther
  }

  const accreditedBodies = organisationHelper.getAccreditedBodySelectOptions(selectedAccreditedBodyOther)

  res.render('../views/courses/accredited-body', {
    accreditedBodyOptions,
    accreditedBodies,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_accredited_body_post = (req, res) => {
  const errors = []

  let selectedAccreditedBody
  if (req.session.data.course && req.session.data.course.accreditedBody) {
    selectedAccreditedBody = req.session.data.course.accreditedBody
  }

  const accreditedBodyOptions = courseHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let selectedAccreditedBodyOther
  if (req.session.data.course && req.session.data.course.accreditedBodyOther) {
    selectedAccreditedBodyOther = req.session.data.course.accreditedBodyOther
  }

  const accreditedBodies = organisationHelper.getAccreditedBodySelectOptions(selectedAccreditedBodyOther)

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      accreditedBodyOptions,
      accreditedBodies,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
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
  res.render('../views/courses/applications-open-date', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_applications_open_date_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`)
    }
  }
}

exports.new_course_course_start_get = (req, res) => {
  let selectedCourseStart
  if (req.session.data.course && req.session.data.course.courseStart) {
    selectedCourseStart = req.session.data.course.courseStart
  }

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStart)

  res.render('../views/courses/course-start', {
    courseStartOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_course_start_post = (req, res) => {
  const errors = []

  let selectedCourseStart
  if (req.session.data.course && req.session.data.course.courseStart) {
    selectedCourseStart = req.session.data.course.courseStart
  }

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStart)

  if (errors.length) {
    res.render('../views/courses/course-start', {
      courseStartOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`)
  }
}

exports.new_course_check_answers_get = (req, res) => {
  res.render('../views/courses/check-your-answers', {
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
  req.flash('success', {
    title: 'Success',
    description: 'Course added'
  })

  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`)
}
