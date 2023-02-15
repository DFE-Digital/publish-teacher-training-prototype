const courseModel = require("../models/courses")
const locationModel = require("../models/locations")
const schoolModel = require("../models/schools")
const organisationModel = require("../models/organisations")
const validationHelper = require("../helpers/validators")

exports.location_list = (req, res) => {
  delete req.session.data.location

  const locations = locationModel.findMany({
    organisationId: req.params.organisationId,
  })

  res.render("../views/locations/list", {
    locations: locations,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
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
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
    },
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW LOCATION
/// ------------------------------------------------------------------------ ///

exports.new_location_get = (req, res) => {
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
    save += "?referrer=check"
  }

  res.render("../views/locations/edit", {
    location: req.session.data.location,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
    },
  })
}

exports.new_location_post = (req, res) => {
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
    save += "?referrer=check"
  }

  const errors = []

  if (!req.session.data.location.name.length) {
    const error = {}
    error.fieldName = "location-name"
    error.href = "#location-name"
    error.text = "Enter a name"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/locations/edit", {
      location: req.session.data.location,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      },
      errors,
    })
  } else {
    if (req.query.referrer && req.query.referrer === "check") {
      res.redirect(
        `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
      )
    } else {
      res.redirect(
        `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/address`
      )
    }
  }
}

exports.new_location_address_get = (req, res) => {
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`

  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
  }

  res.render("../views/locations/address", {
    location: req.session.data.location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/address`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
    },
  })
}

exports.new_location_address_post = (req, res) => {
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`
  if (req.query.referrer === "check") {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
  }
  const errors = []

  if (!req.session.data.location.address.addressLine1.length) {
    const error = {}
    error.fieldName = "address-line-1"
    error.href = "#address-line-1"
    error.text = "Enter building and street"
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
    res.render("../views/locations/address", {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/address`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`
    )
  }
}

exports.new_location_check_get = (req, res) => {
  res.render("../views/locations/check-your-answers", {
    location: req.session.data.location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new/address`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
    },
  })
}

exports.new_location_check_post = (req, res) => {
  const location = locationModel.insertOne({
    organisationId: req.params.organisationId,
    location: req.session.data.location,
  })

  req.flash("success", "Location added")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
    },
  })
}

exports.edit_location_post = (req, res) => {
  const errors = []

  if (!req.session.data.location.name.length) {
    const error = {}
    error.fieldName = "location-name"
    error.href = "#location-name"
    error.text = "Enter a name"
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/locations/edit", {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      },
      errors,
    })
  } else {
    locationModel.updateOne({
      organisationId: req.params.organisationId,
      locationId: req.params.locationId,
      location: req.session.data.location,
    })

    req.flash("success", "Location updated")
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`
    )
  }
}

exports.edit_location_address_get = (req, res) => {
  const location = locationModel.findOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  res.render("../views/locations/address", {
    location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/address`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
    },
  })
}

exports.edit_location_address_post = (req, res) => {
  const errors = []

  if (!req.session.data.location.address.addressLine1.length) {
    const error = {}
    error.fieldName = "address-line-1"
    error.href = "#address-line-1"
    error.text = "Enter building and street"
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
    res.render("../views/locations/address", {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/address`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      },
      errors,
    })
  } else {
    locationModel.updateOne({
      organisationId: req.params.organisationId,
      locationId: req.params.locationId,
      location: req.session.data.location,
    })

    req.flash("success", "Location address updated")
    res.redirect(
      `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
    },
  })
}

exports.delete_location_post = (req, res) => {
  locationModel.deleteOne({
    organisationId: req.params.organisationId,
    locationId: req.params.locationId,
  })

  req.flash("success", "Location removed")
  res.redirect(
    `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
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
