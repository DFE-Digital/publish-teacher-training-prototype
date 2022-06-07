const organisationModel = require('../models/organisations')

exports.cycle_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/cycles/list', {
    organisation
  })

}
