const organisationModel = require('../models/organisations')
const organisationHelper = require('../helpers/organisations')

// exports.home_get = (req, res) => {
//   const organisation = organisationModel.findOne(req.params.organisationId)
//   res.render('../views/organisations/index', {
//     organisation
//   })
// }

exports.organisation_home = (req, res) => {
  const organisation = organisationModel.findOne(req.params.organisationId)
  res.render('../views/organisations/index', {
    organisation
  })
}

exports.organisations_list = (req, res) => {
  if (req.session.data.user.organisations && req.session.data.user.organisations.length > 1) {
    const organisations = req.session.data.user.organisations
    res.render('../views/organisations/list', {
      organisations
    })
  } else {
    const organisationId = req.session.data.user.organisations[0].code
    res.redirect(`/organisations/${organisationId}`);
  }
}

/// ------------------------------------------------------------------------ ///
/// SHOW ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.organisation_detail = (req, res) => {


}

/// ------------------------------------------------------------------------ ///
/// EDIT ORGANISATION
/// ------------------------------------------------------------------------ ///
