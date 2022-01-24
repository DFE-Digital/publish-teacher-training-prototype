const courses = require('../models/courses')

exports.course_list = (req, res) => {
  res.render('../views/courses/list', {
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.course_details = (req, res) => {
  res.send('NOT IMPLEMENTED: Course detail: ' + req.params.courseId)
}

exports.course_description = (req, res) => {
  res.send('NOT IMPLEMENTED: Course description: ' + req.params.courseId)
}

exports.new_course_subject_level_get = (req, res) => {
  res.render('../views/courses/subject-level', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_subject_level_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/subject-level', {
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
  res.render('../views/courses/subject', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_subject_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/subject', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject-level`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`)
  }
}

exports.new_course_age_range_get = (req, res) => {
  res.render('../views/courses/age-range', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_age_range_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/age-range', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/subject`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`)
  }
}

exports.new_course_qualification_get = (req, res) => {
  res.render('../views/courses/qualification', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_qualification_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/qualification', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/age-range`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    // TODO: if organisation is a lead school else scitt
    if (true) {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`)
    }
  }
}

exports.new_course_funding_type_get = (req, res) => {
  res.render('../views/courses/funding-type', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_funding_type_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/funding-type', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
  }
}

exports.new_course_apprenticeship_get = (req, res) => {
  res.render('../views/courses/apprenticeship', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_apprenticeship_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/apprenticeship', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/qualification`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`)
  }
}

exports.new_course_study_mode_get = (req, res) => {
  let back = ''
  // TODO: if organisation is a lead school else scitt
  if (true) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  } else {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  res.render('../views/courses/study-mode', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
      back: back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_study_mode_post = (req, res) => {
  const errors = []

  let back = ''
  // TODO: if organisation is a lead school else scitt
  if (true) {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/funding-type`
  } else {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/apprenticeship`
  }

  if (errors.length) {
    res.render('../views/courses/study-mode', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
        back: back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`)
  }
}

exports.new_course_location_get = (req, res) => {
  res.render('../views/courses/location', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_location_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/location', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/study-mode`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`)
  }
}

exports.new_course_accredited_body_get = (req, res) => {
  res.render('../views/courses/accredited-body', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_accredited_body_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/accredited-body`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/location`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`)
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
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start-date`)
  }
}

exports.new_course_course_start_date_get = (req, res) => {
  res.render('../views/courses/course-start-date', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start-date`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/applications-open-date`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
    }
  })
}

exports.new_course_course_start_date_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/course-start-date', {
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start-date`,
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
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new/course-start-date`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`
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
