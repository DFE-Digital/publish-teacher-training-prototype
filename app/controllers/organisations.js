const organisationModel = require('../models/organisations')
const organisationHelper = require('../helpers/organisations')

exports.home_get = (req, res) => {
  res.render('../views/organisations/index', {

  })
}

exports.organisations_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Organisation list')
}

exports.organisation_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Organisation detail: ' + req.params.organisationId)
}
