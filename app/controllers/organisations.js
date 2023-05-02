const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')

const cycleHelper = require('../helpers/cycles')
const organisationHelper = require('../helpers/organisations')
const validationHelper = require("../helpers/validators")
const visaSponsorshipHelper = require('../helpers/visa-sponsorship')

exports.organisations_list = (req, res) => {
  const isRollover = process.env.IS_ROLLOVER
  const cycleId = req.params.cycleId || cycleHelper.CURRENT_CYCLE.code

  if (req.session.passport.user.organisations && req.session.passport.user.organisations.length > 1) {
    const organisations = req.session.passport.user.organisations

    if (isRollover === 'true') {
      res.render('../views/organisations/list', {
        organisations
      })
    } else {
      res.render('../views/organisations/list', {
        organisations,
        cycleId
      })
    }
  } else {
    const organisationId = req.session.passport.user.organisations[0].id

    if (isRollover) {
      res.redirect(`/organisations/${organisationId}/cycles`)
    } else {
      res.redirect(`/organisations/${organisationId}/cycles/${cycleId}`)
    }
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

  res.render('../views/organisations/details', {
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

exports.organisation_description = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/description', {
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

exports.organisation_visa_sponsorship = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/visa-sponsorship', {
    organisation,
    actions: {
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT ORGANISATION
/// ------------------------------------------------------------------------ ///

exports.edit_organisation_details_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const currentOrganisation = organisation

  res.render('../views/organisations/edit', {
    organisation,
    currentOrganisation,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/edit`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_organisation_details_post = (req, res) => {
  let organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  organisation = req.session.data.organisation

  const currentOrganisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  const errors = []

  if (!organisation.ukprn.length) {
    const error = {}
    error.fieldName = 'organisation-ukprn'
    error.href = '#organisation-ukprn'
    error.text = 'Enter a UK provider reference number (UKPRN)'
    errors.push(error)
  } else if (
    !validationHelper.isValidUKPRN(
      organisation.ukprn
    )
  ) {
    const error = {}
    error.fieldName = 'organisation-ukprn'
    error.href = '#organisation-ukprn'
    error.text = 'Enter a valid UK provider reference number (UKPRN) - it must be 8 digits starting with a 1, like 12345678'
    errors.push(error)
  }

  if (currentOrganisation.type === 'lead_school') {
    if (!organisation.urn.length) {
      const error = {}
      error.fieldName = 'organisation-urn'
      error.href = '#organisation-urn'
      error.text = 'Enter a unique reference number (URN)'
      errors.push(error)
    } else if (
      !validationHelper.isValidURN(
        organisation.urn
      )
    ) {
      const error = {}
      error.fieldName = 'organisation-urn'
      error.href = '#organisation-urn'
      error.text = 'Enter a valid unique reference number (URN) - it must be 5 or 6 digits long'
      errors.push(error)
    }
  }

  if (errors.length) {
    res.render('../views/organisations/edit', {
      organisation,
      currentOrganisation,
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
      organisation
    })

    req.flash('success', 'Organisation details updated')
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

    req.flash('success', 'Training with your organisation updated')
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

    req.flash('success', 'Training with disabilites and other needs updated')
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

    req.flash('success', 'Contact details updated')
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

    req.flash('success', 'Visa sponsorship updated')
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

    req.flash('success', 'Visa sponsorship updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}
