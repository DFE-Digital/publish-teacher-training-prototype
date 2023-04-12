const courseModel = require("../models/courses")
const locationModel = require("../models/locations")
const schoolModel = require("../models/schools")
const organisationModel = require("../models/organisations")
const validationHelper = require("../helpers/validators")

exports.location_list = (req, res) => {
  delete req.session.data.location
  delete req.session.data.school

  const locations = locationModel.findMany({
    organisationId: req.params.organisationId,
  })

  res.render("../views/locations/index", {
    locations: locations,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
      back: "/",
    },
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW LOCATION
/// ------------------------------------------------------------------------ ///

exports.location_details = (req, res) => {
  const location = locationModel.findOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  res.render("../views/locations/show", {
    location,
    actions: {
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`
    },
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW LOCATION
/// ------------------------------------------------------------------------ ///

exports.new_location_find_get = (req, res) => {

  res.render("../views/locations/find", {
    school: req.session.data.school,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new`,
      edit: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
    },
  })
}

exports.new_location_find_post = (req, res) => {
  const errors = []

  if (!req.session.data.school.length) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Enter a school, university, college, URN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/locations/find", {
      school: req.session.data.school,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new`,
        edit: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`
    )
  }
}

exports.new_location_edit_get = (req, res) => {
  let location = {}
  if (req.session.data.location) {
    location = req.session.data.location
  } else {
   location = schoolModel.findOne({ name: req.session.data.school })
  }

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/check`
  }

  res.render("../views/locations/edit", {
    location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
    },
  })
}

exports.new_location_edit_post = (req, res) => {
  const location = req.session.data.location

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new`

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/check`
    save += '?referrer=check'
  }

  const errors = []

  if (!req.session.data.location.name.length) {
    const error = {}
    error.fieldName = "location-name"
    error.href = "#location-name"
    error.text = "Enter a school name"
    errors.push(error)
  }

  if (!req.session.data.location.address.addressLine1.length) {
    const error = {}
    error.fieldName = "address-line-1"
    error.href = "#address-line-1"
    error.text = "Enter address line 1"
    errors.push(error)
  }

  if (!req.session.data.location.address.town.length) {
    const error = {}
    error.fieldName = "address-town"
    error.href = "#address-town"
    error.text = "Enter town or city"
    errors.push(error)
  }

  if (!req.session.data.location.address.postcode.length) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter postcode"
    errors.push(error)
  } else if (
    !validationHelper.isValidPostcode(
      req.session.data.location.address.postcode
    )
  ) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter a real postcode"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/locations/edit", {
      location,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/check`
    )
  }
}

exports.new_location_check_get = (req, res) => {
  res.render("../views/locations/check-your-answers", {
    location: req.session.data.location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/new/edit`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`,
    },
  })
}

exports.new_location_check_post = (req, res) => {
  const location = locationModel.insertOne({
    organisationId: req.params.organisationId,
    location: req.session.data.location,
  })

  delete req.session.data.location
  delete req.session.data.school

  req.flash("success", "School added")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`
  )
}

/// ------------------------------------------------------------------------ ///
/// EDIT LOCATION
/// ------------------------------------------------------------------------ ///

exports.edit_location_get = (req, res) => {
  const location = locationModel.findOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  res.render("../views/locations/edit", {
    location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
    },
  })
}

exports.edit_location_post = (req, res) => {
  const errors = []

  if (!req.session.data.location.name.length) {
    const error = {}
    error.fieldName = "location-name"
    error.href = "#location-name"
    error.text = "Enter a school name"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/locations/edit", {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
      },
      errors,
    })
  } else {
    locationModel.updateOne({
      organisationId: req.params.organisationId,
      locationId: req.params.locationId,
      location: req.session.data.location,
    })

    req.flash("success", "School updated")
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`
    )
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE LOCATION
/// ------------------------------------------------------------------------ ///

exports.delete_location_get = (req, res) => {
  const organisation = organisationModel.findOne({
    organisationId: req.params.organisationId,
  })

  const location = locationModel.findOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  const courses = courseModel
    .findMany({ organisationId: req.params.organisationId })
    .filter((course) => {
      return course.locations.find(
        (location) => location.id === req.params.locationId
      )
    })

  const hasCourses = !!courses.length

  res.render("../views/locations/delete", {
    organisation,
    location,
    hasCourses,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools/${req.params.locationId}`,
    },
  })
}

exports.delete_location_post = (req, res) => {
  locationModel.deleteOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  req.flash("success", "School removed")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/schools`
  )
}

/// ------------------------------------------------------------------------ ///
/// SCHOOL SUGGESTIONS FOR AUTOCOMPLETE
/// ------------------------------------------------------------------------ ///

exports.school_suggestions_json = (req, res) => {
  req.headers['Access-Control-Allow-Origin'] = true

  let schools
  schools = schoolModel.findMany(req.query)

  schools.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  res.json(schools)
}
