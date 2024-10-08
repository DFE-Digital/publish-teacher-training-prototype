const organisationModel = require('../models/organisations')

const cycleHelper = require('../helpers/cycles')
const validationHelper = require("../helpers/validators")
const visaSponsorshipHelper = require('../helpers/visa-sponsorship')
const schoolPlacementHelper = require('../helpers/school-placement')

const settings = require('../data/dist/settings')

exports.organisations_list = (req, res) => {
  const isRollover = settings.isRollover || process.env.IS_ROLLOVER
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

    if (isRollover === 'true') {
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
  let organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  organisation = req.session.data.organisation

  const errors = []

  if (!organisation.contact.email.length) {
    const error = {}
    error.fieldName = 'organisation-email'
    error.href = '#organisation-email'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (
    !validationHelper.isValidEmail(
      organisation.contact.email
    )
  ) {
    const error = {}
    error.fieldName = 'organisation-email'
    error.href = '#organisation-email'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  }

  if (!organisation.contact.telephone.length) {
    const error = {}
    error.fieldName = 'organisation-telephone'
    error.href = '#organisation-telephone'
    error.text = 'Enter a telephone number'
    errors.push(error)
  } else if (
    !validationHelper.isValidTelephone(
      organisation.contact.telephone
    )
  ) {
    const error = {}
    error.fieldName = 'organisation-telephone'
    error.href = '#organisation-telephone'
    error.text = 'Enter a real telephone number'
    errors.push(error)
  }

  if (!organisation.contact.website.length) {
    const error = {}
    error.fieldName = 'organisation-website'
    error.href = '#organisation-website'
    error.text = 'Enter a website address'
    errors.push(error)
  } else if (
    !validationHelper.isValidURL(
      organisation.contact.website
    )
  ) {
    const error = {}
    error.fieldName = 'organisation-website'
    error.href = '#organisation-website'
    error.text = 'Enter a website address in the correct format, like https://www.example.com'
    errors.push(error)
  }

  if (!organisation.address.addressLine1.length) {
    const error = {}
    error.fieldName = "address-line-1"
    error.href = "#address-line-1"
    error.text = "Enter address line 1"
    errors.push(error)
  }

  if (!organisation.address.town.length) {
    const error = {}
    error.fieldName = "address-town"
    error.href = "#address-town"
    error.text = "Enter a town or city"
    errors.push(error)
  }

  if (!organisation.address.postcode.length) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter a postcode"
    errors.push(error)
  } else if (
    !validationHelper.isValidPostcode(
      organisation.address.postcode
    )
  ) {
    const error = {}
    error.fieldName = "address-postcode"
    error.href = "#address-postcode"
    error.text = "Enter a real postcode"
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/organisations/contact-details', {
      organisation,
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
      organisation
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

exports.edit_school_placement_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  let selectedSchoolPlacements
  if (organisation && organisation.showSchoolPlacements) {
    selectedSchoolPlacements = organisation.showSchoolPlacements
  }

  const schoolPlacementOptions = schoolPlacementHelper.getSchoolPlacementOptions(selectedSchoolPlacements)

  res.render('../views/organisations/school-placement', {
    organisation,
    schoolPlacementOptions,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/school-placement`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`
    }
  })
}

exports.edit_school_placement_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const errors = []

  let selectedSchoolPlacements
  if (req.session.data.organisation && req.session.data.organisation.showSchoolPlacements) {
    selectedSchoolPlacements = req.session.data.organisation.showSchoolPlacements
  }

  const schoolPlacementOptions = schoolPlacementHelper.getSchoolPlacementOptions(selectedSchoolPlacements)

  if (errors.length) {
    res.render('../views/organisations/school-placement', {
      organisation,
      schoolPlacementOptions,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/school-placement`,
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

    req.flash('success', 'School placement preferences updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`)
  }
}
