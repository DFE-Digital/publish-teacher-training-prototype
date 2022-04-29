const locationModel = require('../models/locations')

exports.location_list = (req, res) => {
  delete req.session.data.location

  let locations = locationModel.findMany({ organisationId: req.params.organisationId })

  res.render('../views/locations/list', {
    locations: locations,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`,
      view: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      back: `/`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// SHOW LOCATION
/// ------------------------------------------------------------------------ ///

exports.location_details = (req, res) => {
  const location = locationModel.findOne({ organisationId: req.params.organisationId, locationId: req.params.locationId })

  res.render('../views/locations/detail', {
    location,
    actions: {
      delete: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// NEW LOCATION
/// ------------------------------------------------------------------------ ///

exports.new_location_get = (req, res) => {
  res.render('../views/locations/edit', {
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
    }
  })
}

exports.new_location_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/locations/edit', {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/new`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
      },
      errors
    })
  } else {
    locationModel.insertOne({
      organisationId: req.params.organisationId,
      location: req.session.data.location
    })

    req.flash('success','Location added')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`)
  }
}

/// ------------------------------------------------------------------------ ///
/// EDIT LOCATION
/// ------------------------------------------------------------------------ ///

exports.edit_location_get = (req, res) => {
  const location = locationModel.findOne({ organisationId: req.params.organisationId, locationId: req.params.locationId })

  res.render('../views/locations/edit', {
    location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
    }
  })
}

exports.edit_location_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/locations/edit', {
      location: req.session.data.location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
      },
      errors
    })
  } else {
    locationModel.updateOne({
      organisationId: req.params.organisationId,
      locationId: req.params.locationId,
      location: req.session.data.location
    })

    req.flash('success','Location updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`)
  }
}

/// ------------------------------------------------------------------------ ///
/// DELETE LOCATION
/// ------------------------------------------------------------------------ ///

exports.delete_location_get = (req, res) => {
  const location = locationModel.findOne({ organisationId: req.params.organisationId, locationId: req.params.locationId })

  res.render('../views/locations/delete', {
    location,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
    }
  })
}

exports.delete_location_post = (req, res) => {
  const location = locationModel.findOne({ organisationId: req.params.organisationId, locationId: req.params.locationId })
  const errors = []

  if (errors.length) {
    res.render('../views/locations/delete', {
      location,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations/${req.params.locationId}/delete`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`
      },
      errors
    })
  } else {
    locationModel.deleteOne({
      organisationId: req.params.organisationId,
      locationId: req.params.locationId
    })

    req.flash('success','Location deleted')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/locations`)
  }
}
