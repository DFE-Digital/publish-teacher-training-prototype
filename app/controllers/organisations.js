const organisationModel = require('../models/organisations')
const organisationHelper = require('../helpers/organisations')

// exports.home_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   res.render('../views/organisations/index', {
//     organisation
//   })
// }

exports.organisation_home = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
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
    const organisationId = req.session.data.user.organisations[0].id
    res.redirect(`/organisations/${organisationId}`);
  }
}

/// ------------------------------------------------------------------------ ///
/// SHOW ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.organisation_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  res.render('../views/organisations/details', {
    organisation,
    actions: {
      change: ``
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.edit_organisation_details_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/edit', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/edit`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_organisation_details_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/edit', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/edit`,
        back: `/organisations/${req.params.organisationId}/details`,
        cancel: `/organisations/${req.params.organisationId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Location updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}
