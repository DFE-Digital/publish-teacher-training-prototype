const locationModel = require('../models/locations')

exports.location_list = (req, res) => {
  delete req.session.data.location

  let locations = locationModel.find({ organisationId: req.params.organisationId })

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

exports.location_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Location detail: ' + req.params.locationId)
}

/// ------------------------------------------------------------------------ ///
/// EDIT LOCATION
/// ------------------------------------------------------------------------ ///

/// ------------------------------------------------------------------------ ///
/// NEW LOCATION
/// ------------------------------------------------------------------------ ///
