const courseModel = require("../models/courses")
const schoolModel = require("../models/schools")
const studySiteModel = require("../models/study-sites")
const organisationModel = require("../models/organisations")
const validationHelper = require("../helpers/validators")

exports.study_site_list = (req, res) => {
  delete req.session.data.studySite
  delete req.session.data.school

  const studySites = studySiteModel.findMany({
    organisationId: req.params.organisationId,
  })

  res.render("../views/study-sites/index", {
    studySites,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
      back: "/",
    },
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW STUDY SITE
/// ------------------------------------------------------------------------ ///

exports.study_site_details = (req, res) => {
  const studySite = studySiteModel.findOne({
    organisationId: req.params.organisationId,
    studySiteId: req.params.studySiteId,
  })

  res.render("../views/study-sites/show", {
    studySite,
    actions: {
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`
    },
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW STUDY SITE
/// ------------------------------------------------------------------------ ///

exports.new_study_site_find_get = (req, res) => {

  res.render("../views/study-sites/find", {
    school: req.session.data.school,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new`,
      edit: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
    },
  })
}

exports.new_study_site_find_post = (req, res) => {
  const errors = []

  if (!req.session.data.school.length) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Enter a school, university, college, URN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/study-sites/find", {
      school: req.session.data.school,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new`,
        edit: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`
    )
  }
}

exports.new_study_site_edit_get = (req, res) => {
  let studySite = {}
  if (req.session.data.studySite) {
    studySite = req.session.data.studySite
  } else {
   studySite = schoolModel.findOne({ name: req.session.data.school })
  }

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/check`
  }

  res.render("../views/study-sites/edit", {
    studySite,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
    },
  })
}

exports.new_study_site_edit_post = (req, res) => {
  const studySite = req.session.data.studySite

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new`

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.studySite.name.length) {
    const error = {}
    error.fieldName = "study-site-name"
    error.href = "#study-site-name"
    error.text = "Enter a study site name"
    errors.push(error)
  }

  if (!req.session.data.studySite.address.addressLine1.length) {
    const error = {}
    error.fieldName = "address-line-1"
    error.href = "#address-line-1"
    error.text = "Enter address line 1"
    errors.push(error)
  }

  if (!req.session.data.studySite.address.town.length) {
    const error = {}
    error.fieldName = "address-town"
    error.href = "#address-town"
    error.text = "Enter a town or city"
    errors.push(error)
  }

  if (!req.session.data.studySite.address.postcode.length) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter a postcode"
    errors.push(error)
  } else if (
    !validationHelper.isValidPostcode(
      req.session.data.studySite.address.postcode
    )
  ) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter a real postcode"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/study-sites/edit", {
      studySite,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/check`
    )
  }
}

exports.new_study_site_check_get = (req, res) => {
  res.render("../views/study-sites/check-your-answers", {
    studySite: req.session.data.studySite,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/new/edit`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`,
    },
  })
}

exports.new_study_site_check_post = (req, res) => {
  studySiteModel.insertOne({
    organisationId: req.params.organisationId,
    studySite: req.session.data.studySite,
  })

  delete req.session.data.studySite
  delete req.session.data.school

  req.flash("success", "Study site added")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`
  )
}

/// ------------------------------------------------------------------------ ///
/// EDIT STUDY SITE
/// ------------------------------------------------------------------------ ///

exports.edit_study_site_get = (req, res) => {
  const studySite = studySiteModel.findOne({
    organisationId: req.params.organisationId,
    studySiteId: req.params.studySiteId,
  })

  res.render("../views/study-sites/edit", {
    studySite,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
    },
  })
}

exports.edit_study_site_post = (req, res) => {
  const errors = []

  if (!req.session.data.studySite.name.length) {
    const error = {}
    error.fieldName = "study-site-name"
    error.href = "#study-site-name"
    error.text = "Enter a study site name"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/study-sites/edit", {
      studySite: req.session.data.studySite,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
      },
      errors,
    })
  } else {
    studySiteModel.updateOne({
      organisationId: req.params.organisationId,
      studySiteId: req.params.studySiteId,
      studySite: req.session.data.studySite,
    })

    req.flash("success", "Study site updated")
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`
    )
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE STUDY SITE
/// ------------------------------------------------------------------------ ///

exports.delete_study_site_get = (req, res) => {
  const organisation = organisationModel.findOne({
    organisationId: req.params.organisationId,
  })

  const studySite = studySiteModel.findOne({
    organisationId: req.params.organisationId,
    studySiteId: req.params.studySiteId,
  })

  // const courses = courseModel
  //   .findMany({ organisationId: req.params.organisationId })
  //   .filter((course) => {
  //     return course.studySites.find(
  //       (studySite) => studySite.id === req.params.studySiteId
  //     )
  //   })

  // const hasCourses = !!courses.length

  res.render("../views/study-sites/delete", {
    organisation,
    studySite,
    // hasCourses,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites/${req.params.studySiteId}`,
    },
  })
}

exports.delete_study_site_post = (req, res) => {
  studySiteModel.deleteOne({
    organisationId: req.params.organisationId,
    studySiteId: req.params.studySiteId,
  })

  req.flash("success", "Study site removed")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/study-sites`
  )
}

/// ------------------------------------------------------------------------ ///
/// SCHOOL SUGGESTIONS FOR AUTOCOMPLETE
/// ------------------------------------------------------------------------ ///

exports.study_site_suggestions_json = (req, res) => {
  req.headers['Access-Control-Allow-Origin'] = true

  let schools
  schools = schoolModel.findMany(req.query)

  schools.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  res.json(schools)
}
