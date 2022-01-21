const organisations = require('../models/organisations')

exports.home_get = (req, res) => {
  res.render('../views/organisations/index', {

  })
}

exports.organisation_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Organisation list')
}

exports.organisation_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Organisation detail: ' + req.params.organisationId)
}
