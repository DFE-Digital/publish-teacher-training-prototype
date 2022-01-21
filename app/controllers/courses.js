const courses = require('../models/courses')

exports.course_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Course list')
  res.render('', {})
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
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_subject_level_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/subject-level', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_subject_get = (req, res) => {
  res.render('../views/courses/subject', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_subject_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/subject', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_age_range_get = (req, res) => {
  res.render('../views/courses/age-range', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_age_range_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/age-range', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_qualification_get = (req, res) => {
  res.render('../views/courses/qualifications', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_qualification_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/qualifications', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_funding_type_get = (req, res) => {
  res.render('../views/courses/funding-type', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_funding_type_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/funding-type', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_study_mode_get = (req, res) => {
  res.render('../views/courses/study-mode', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_study_mode_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/study-mode', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_location_get = (req, res) => {
  res.render('../views/courses/location', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_location_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/location', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_accredited_body_get = (req, res) => {
  res.render('../views/courses/accredited-body', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_accredited_body_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/accredited-body', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_applications_open_date_get = (req, res) => {
  res.render('../views/courses/applications-open-date', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_applications_open_date_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/applications-open-date', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_course_start_date_get = (req, res) => {
  res.render('../views/courses/course-start-date', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_course_start_date_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/courses/course-start-date', {
      actions: {
        save: ``,
        back: ``,
        cancel: ``
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
  }
}

exports.new_course_check_answers_get = (req, res) => {
  res.render('../views/courses/check-your-answers', {
    actions: {
      save: ``,
      back: ``,
      cancel: ``
    }
  })
}

exports.new_course_check_answers_post = (req, res) => {
  req.flash('success', {
    title: '',
    description: ''
  })

  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses/new`)
}
