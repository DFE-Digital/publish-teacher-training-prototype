const locations = require('../models/locations')

exports.location_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Location list')
}

exports.location_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Location detail: ' + req.params.locationId)
}
