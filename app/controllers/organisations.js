const organisationModel = require('../models/organisations')
const organisationHelper = require('../helpers/organisations')
const visaSponsorshipHelper = require('../helpers/visa-sponsorship')

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
  if (req.session.passport.user.organisations && req.session.passport.user.organisations.length > 1) {
    const organisations = req.session.passport.user.organisations
    res.render('../views/organisations/list', {
      organisations
    })
  } else {
    const organisationId = req.session.passport.user.organisations[0].id
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
      back: `/organisations/${req.params.organisationId}`,
      change: `/organisations/${req.params.organisationId}`
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

    req.flash('success','Organisation details updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_training_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/training', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/training`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_training_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/training', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/training`,
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

    req.flash('success','Training with your organisation updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_disabilities_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/disabilities', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/training-with-disabilities`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_disabilities_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/disabilities', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/training-with-disabilities`,
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

    req.flash('success','Training with disabilites and other needs updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_contact_details_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/contact-details', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/contact-details`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_contact_details_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/contact-details', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/contact-details`,
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

    req.flash('success','Contact details updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_student_visa_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedStudentVisa
  if (organisation && organisation.visaSponsorship.canSponsorStudentVisa) {
    selectedStudentVisa = organisation.visaSponsorship.canSponsorStudentVisa
  }

  const studentVisaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedStudentVisa)

  res.render('../views/organisations/student-visa', {
    organisation,
    studentVisaOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/student-visa`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_student_visa_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedStudentVisa
  if (req.session.data.organisation && req.session.data.organisation.visaSponsorship.canSponsorStudentVisa) {
    selectedStudentVisa = req.session.data.organisation.visaSponsorship.canSponsorStudentVisa
  }

  const studentVisaOptions = visaSponsorshipHelper.getStudentVisaOptions(selectedStudentVisa)

  if (errors.length) {
    res.render('../views/organisations/student-visa', {
      organisation,
      studentVisaOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/student-visa`,
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

    req.flash('success','Visa sponsorship updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_skilled_worker_visa_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedSkilledWorkerVisa
  if (organisation && organisation.visaSponsorship.canSponsorSkilledWorkerVisa) {
    selectedSkilledWorkerVisa = organisation.visaSponsorship.canSponsorSkilledWorkerVisa
  }

  const skilledWorkerVisaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedSkilledWorkerVisa)

  res.render('../views/organisations/skilled-worker-visa', {
    organisation,
    skilledWorkerVisaOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/skilled-worker-visa`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_skilled_worker_visa_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedSkilledWorkerVisa
  if (req.session.data.organisation && req.session.data.organisation.visaSponsorship.canSponsorSkilledWorkerVisa) {
    selectedSkilledWorkerVisa = req.session.data.organisation.visaSponsorship.canSponsorSkilledWorkerVisa
  }

  const skilledWorkerVisaOptions = visaSponsorshipHelper.getSkilledWorkerVisaOptions(selectedSkilledWorkerVisa)

  if (errors.length) {
    res.render('../views/organisations/skilled-worker-visa', {
      organisation,
      skilledWorkerVisaOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/skilled-worker-visa`,
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

    req.flash('success','Visa sponsorship updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}

exports.edit_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  res.render('../views/organisations/accredited-body', {
    organisation,
    accreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/accredited-bodies/${req.params.accreditedBodyId}`,
      back: `/organisations/${req.params.organisationId}/details`,
      cancel: `/organisations/${req.params.organisationId}/details`
    }
  })
}

exports.edit_accredited_body_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedBody.description = req.session.data.organisation.accreditedBody.description

  const errors = []

  if (errors.length) {
    res.render('../views/organisations/accredited-body', {
      organisation,
      accreditedBody,
      actions: {
        save: `/organisations/${req.params.organisationId}/accredited-bodies/${req.params.accreditedBodyId}`,
        back: `/organisations/${req.params.organisationId}/details`,
        cancel: `/organisations/${req.params.organisationId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      accreditedBodyId: req.params.accreditedBodyId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Accredited body description updated')
    res.redirect(`/organisations/${req.params.organisationId}/details`)
  }
}
