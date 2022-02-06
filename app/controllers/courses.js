const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const organisationRelationshipModel = require('../models/organisation-relationships')

const courseHelper = require('../helpers/courses')
const locationHelper = require('../helpers/locations')
const organisationHelper = require('../helpers/organisations')
const subjectHelper = require('../helpers/subjects')

exports.course_list = (req, res) => {
  // clean out course data
  delete req.session.data.course

  let courses = courseModel.find({ organisationId: req.params.organisationId })

  courses.sort((a,b) => {
    return a.name.localeCompare(b.name)
      || a.qualification.localeCompare(b.qualification)
      || a.studyMode.localeCompare(b.studyMode)
  })

  // const relationships = organisationRelationshipModel.find({organisationId: req.params.organisationId}).accreditedBodies
  //
  // let groupedCourses = []
  //
  // if (relationships.length) {
  //   courses.sort((a,b) => {
  //     return a.accreditedBody.name.localeCompare(b.accreditedBody.name)
  //       || a.name.localeCompare(b.name)
  //       || a.qualification.localeCompare(b.qualification)
  //       || a.studyMode.localeCompare(b.studyMode)
  //   })
  //
  //   relationships.forEach((relationship, i) => {
  //     const group = {}
  //     group.code = relationship.code
  //     group.name = relationship.name
  //     group.courses = courses.filter(course => course.accreditedBody.code === relationship.code)
  //     groupedCourses.push(group)
  //   })
  // } else {
  //   courses.sort((a,b) => {
  //     return a.name.localeCompare(b.name)
  //       || a.qualification.localeCompare(b.qualification)
  //       || a.studyMode.localeCompare(b.studyMode)
  //   })
  //   groupedCourses.push({courses: courses})
  // }

  res.render('../views/courses/list', {
    courses: courses,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      back: `/`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW COURSE
/// ------------------------------------------------------------------------ ///

exports.course_details = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const organisation = organisationModel.findOne(req.params.organisationId)
  res.render('../views/courses/details', {
    course,
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.course_description = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const organisation = organisationModel.findOne(req.params.organisationId)
  res.render('../views/courses/description', {
    course,
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`,
      description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT COURSE
/// ------------------------------------------------------------------------ ///

exports.edit_course_send_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSend
  if (req.session.data.course && req.session.data.course.isSend) {
    selectedSend = req.session.data.course.isSend
  }
  const sendOptions = courseHelper.getSendOptions(selectedSend)

  res.render('../views/courses/special-educational-needs-disability', {
    course,
    sendOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_subject_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSubject)

  res.render('../views/courses/subject', {
    course,
    subjectOptions,
    actions: {
      save: ``,
      back: ``,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_subject_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(course.subjectLevel, selectedSubject)

  if (errors.length) {
    res.render('../views/courses/subject', {
      course,
      subjectOptions,
      actions: {
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    if (selectedSubject === 'ML') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/modern-language`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
    }
  }
}

exports.edit_course_modern_language_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = req.session.data.course.childSubjects
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions(course.subject, selectedSubject)

  res.render('../views/courses/modern-languages', {
    course,
    subjectOptions,
    actions: {
      save: ``,
      back: ``,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_modern_language_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedSubject
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = req.session.data.course.childSubjects
  }

  const subjectOptions = subjectHelper.getChildSubjectOptions(course.subject, selectedSubject)

  if (errors.length) {
    res.render('../views/courses/modern-languages', {
      course,
      subjectOptions,
      actions: {
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}/age-range`)
  }
}

exports.edit_course_age_range_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedAgeRange
  if (req.session.data.course && req.session.data.course.ageRange) {
    selectedAgeRange = req.session.data.course.ageRange
  }

  const ageRangeOptions = courseHelper.getAgeRangeOptions(course.subjectLevel, selectedAgeRange)

  res.render('../views/courses/age-range', {
    course,
    ageRangeOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_qualification_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedQualification
  if (req.session.data.course && req.session.data.course.qualification) {
    selectedQualification = req.session.data.course.qualification
  }

  const qualificationOptions = courseHelper.getQualificationOptions(course.subjectLevel, selectedQualification)

  res.render('../views/courses/qualification', {
    course,
    qualificationOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_funding_type_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedFundingType
  if (req.session.data.course && req.session.data.course.fundingType) {
    selectedFundingType = req.session.data.course.fundingType
  }

  const fundingTypeOptions = courseHelper.getFundingTypeOptions(selectedFundingType)

  res.render('../views/courses/funding-type', {
    course,
    fundingTypeOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_apprenticeship_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.apprenticeship) {
    selectedApprenticeshipOption = req.session.data.course.apprenticeship
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  res.render('../views/courses/apprenticeship', {
    course,
    apprenticeshipOptions,
    actions: {
      save: ``,
      back: ``,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_apprenticeship_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  const errors = []

  let selectedApprenticeshipOption
  if (req.session.data.course && req.session.data.course.apprenticeship) {
    selectedApprenticeshipOption = req.session.data.course.apprenticeship
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
      course,
      apprenticeshipOptions,
      actions: {
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_study_mode_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedStudyMode
  if (req.session.data.course && req.session.data.course.studyMode) {
    selectedStudyMode = req.session.data.course.studyMode
  }

  const studyModeOptions = courseHelper.getStudyModeOptions(selectedStudyMode)

  res.render('../views/courses/study-mode', {
    course,
    studyModeOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_location_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedLocation
  if (req.session.data.course && req.session.data.course.locations) {
    selectedLocation = req.session.data.course.locations
  }

  const locationOptions = locationHelper.getLocationOptions(req.params.organisationId, selectedLocation)

  res.render('../views/courses/location', {
    course,
    locationOptions,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_accredited_body_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

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
    course,
    accreditedBodyOptions,
    accreditedBodies,
    actions: {
      save: ``,
      back: ``,
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

  const accreditedBodyOptions = courseHelper.getAccreditedBodyOptions(req.params.organisationId, selectedAccreditedBody)

  let selectedAccreditedBodyOther
  if (req.session.data.course && req.session.data.course.accreditedBodyOther) {
    selectedAccreditedBodyOther = req.session.data.course.accreditedBodyOther
  }

  const accreditedBodies = organisationHelper.getAccreditedBodySelectOptions(selectedAccreditedBodyOther)

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      course,
      accreditedBodyOptions,
      accreditedBodies,
      actions: {
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_applications_open_date_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  res.render('../views/courses/applications-open-date', {
    course,
    actions: {
      save: ``,
      back: ``,
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
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

exports.edit_course_course_start_get = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })

  let selectedCourseStart
  if (req.session.data.course && req.session.data.course.courseStart) {
    selectedCourseStart = req.session.data.course.courseStart
  }

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStart)

  res.render('../views/courses/course-start', {
    course,
    courseStartOptions,
    actions: {
      save: ``,
      back: ``,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
    }
  })
}

exports.edit_course_course_start_post = (req, res) => {
  const course = courseModel.findOne({ organisationId: req.params.organisationId, courseId: req.params.courseId })
  const errors = []

  let selectedCourseStart
  if (req.session.data.course && req.session.data.course.courseStart) {
    selectedCourseStart = req.session.data.course.courseStart
  }

  const courseStartOptions = courseHelper.getCourseStartSelectOptions(selectedCourseStart)

  if (errors.length) {
    res.render('../views/courses/course-start', {
      course,
      courseStartOptions,
      actions: {
        save: ``,
        back: ``,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/${req.params.courseId}`)
  }
}

/// ------------------------------------------------------------------------ ///
/// NEW COURSE
/// ------------------------------------------------------------------------ ///

exports.new_course_get = (req, res) => {
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`);
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
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`)
  }
}

exports.new_course_subject_get = (req, res) => {
  let selectedSubject
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/subject', {
    subjectOptions,
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
  if (req.session.data.course && req.session.data.course.subject) {
    selectedSubject = req.session.data.course.subject
  }

  const subjectOptions = subjectHelper.getSubjectOptions(req.session.data.course.subjectLevel, selectedSubject)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/subject', {
      subjectOptions,
      actions: {
        save,
        back,
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
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = req.session.data.course.childSubjects
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
  if (req.session.data.course && req.session.data.course.childSubjects) {
    selectedSubject = req.session.data.course.childSubjects
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
    if (req.session.data.course.childSubjects && req.session.data.course.childSubjects.length) {
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
    if (req.session.data.course.childSubjects && req.session.data.course.childSubjects.length) {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/qualification', {
    qualificationOptions,
    actions: {
      save,
      back,
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/qualification', {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/funding-type', {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/apprenticeship', {
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
  if (req.session.data.course && req.session.data.course.apprenticeship) {
    selectedApprenticeshipOption = req.session.data.course.apprenticeship
  }

  const apprenticeshipOptions = courseHelper.getApprenticeshipOptions(selectedApprenticeshipOption)

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/qualification`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  // TODO: if organisation is a lead school else scitt
  if (false) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/study-mode', {
    studyModeOptions,
    actions: {
      save,
      back,
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`

  // TODO: if organisation is a lead school else scitt
  if (false) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/study-mode', {
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

  res.render('../views/courses/location', {
    locationOptions,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_location_post = (req, res) => {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/accredited-body', {
    accreditedBodyOptions,
    accreditedBodies,
    actions: {
      save,
      back,
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      accreditedBodyOptions,
      accreditedBodies,
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
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/applications-open-date', {
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
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  res.render('../views/courses/course-start', {
    courseStartOptions,
    actions: {
      save,
      back,
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

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`
  }

  if (errors.length) {
    res.render('../views/courses/course-start', {
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
