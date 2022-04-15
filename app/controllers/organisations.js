const organisationModel = require('../models/organisations')
const organisationHelper = require('../helpers/organisations')
const visaSponsorshipHelper = require('../helpers/visa-sponsorship')

exports.organisations_list = (req, res) => {
  if (req.session.passport.user.organisations && req.session.passport.user.organisations.length > 1) {
    const organisations = req.session.passport.user.organisations
    res.render('../views/organisations/list', {
      organisations
    })
  } else {
    const organisationId = req.session.passport.user.organisations[0].id
    res.redirect(`/organisations/${organisationId}/cycles/2022`);
  }
}

/// ------------------------------------------------------------------------ ///
/// ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.organisation = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  // put the selected organisation into the passport object
  // for use around the service
  req.session.passport.organisation = organisation

  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/courses`)
}

/// ------------------------------------------------------------------------ ///
/// SHOW ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.organisation_details = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  // clear out the session
  delete req.session.data.organisation

  res.render('../views/organisations/details', {
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_organisation_details_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/edit', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/edit`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Organisation details updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}

exports.edit_training_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/training', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_training_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/training', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Training with your organisation updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}

exports.edit_disabilities_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/disabilities', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-with-disabilities`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_disabilities_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/disabilities', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/training-with-disabilities`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Training with disabilites and other needs updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}

exports.edit_contact_details_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/contact-details', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/contact-details`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_contact_details_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render('../views/organisations/contact-details', {
      organisation: req.session.data.organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/contact-details`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Contact details updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/student-visa`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
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
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/student-visa`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Visa sponsorship updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
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
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/skilled-worker-visa`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
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
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/skilled-worker-visa`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    organisationModel.updateOne({
      organisationId: req.params.organisationId,
      organisation: req.session.data.organisation
    })

    req.flash('success','Visa sponsorship updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}

/// ------------------------------------------------------------------------ ///
/// EDIT ACCREDITED BODY
/// ------------------------------------------------------------------------ //

exports.edit_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  res.render('../views/organisations/accredited-body', {
    organisation,
    accreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  let accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedBody.description = req.session.data.organisation.accreditedBody.description

  const errors = []

  if (errors.length) {
    res.render('../views/organisations/accredited-body', {
      organisation,
      accreditedBody,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
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
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}

/// ------------------------------------------------------------------------ ///
/// NEW ACCREDITED BODY
/// ------------------------------------------------------------------------ //

exports.new_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  console.log('New (GET)', req.session.data);

  let selectedAccreditedBody
  if (req.session.data.organisation && req.session.data.organisation.accreditedBody.id) {
    selectedAccreditedBody = req.session.data.organisation.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodySelectOptions(selectedAccreditedBody)

  res.render('../views/organisations/accredited-bodies/new', {
    organisation,
    accreditedBodyOptions,
    selectedAccreditedBody,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.new_accredited_body_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  console.log('New (POST)', req.session.data);

  let selectedAccreditedBody
  if (req.session.data.organisation && req.session.data.organisation.accreditedBody.id) {
    selectedAccreditedBody = req.session.data.organisation.accreditedBody.id
  }

  const accreditedBodyOptions = organisationHelper.getAccreditedBodySelectOptions(selectedAccreditedBody)

  // let selectedAccreditedBodyOption
  // let selectedAccreditedBodyName
  // if (req.session.data.accreditedBody) {
  //   selectedAccreditedBodyOption = accreditedBodyOptions.find(
  //     accreditedBody => accreditedBody.value === req.session.data.accreditedBody
  //   )
  //
  //   if (selectedAccreditedBodyOption) {
  //     selectedAccreditedBodyName = selectedAccreditedBodyOption.text
  //   }
  // }

  const errors = []

  if (errors.length) {
    res.render('../views/organisations/accredited-bodies/new', {
      organisation,
      accreditedBodyOptions,
      selectedAccreditedBody,
      // selectedAccreditedBodyName,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`)
  }
}

exports.new_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })



  res.render('../views/organisations/accredited-bodies/description', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.new_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const errors = []

  if (errors.length) {
    res.render('../views/organisations/accredited-bodies/description', {
      organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
  }
}

exports.new_accredited_body_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/accredited-bodies/check-your-answers', {
    organisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.new_accredited_body_check_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const errors = []

  if (errors.length) {
    res.render('../views/organisations/accredited-bodies/check-your-answers', {
      organisation,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
      },
      errors
    })
  } else {
    req.flash('success','Accredited body added')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}
