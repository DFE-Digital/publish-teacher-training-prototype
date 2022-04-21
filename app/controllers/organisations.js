const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const accreditedBodyModel = require('../models/accredited-bodies')
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
  delete req.session.data.accreditedBody

  res.render('../views/organisations/details', {
    organisation,
    actions: {
      // details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      // description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/description`,
      // partners: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      // visas: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/visa-sponsorship`,
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
      // details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      // description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/description`,
      // partners: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      // visas: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/visa-sponsorship`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

// exports.organisation_accredited_bodies = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   // clear out the session
//   delete req.session.data.accreditedBody
//
//   res.render('../views/organisations/accredited-bodies', {
//     organisation,
//     actions: {
//       details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
//       description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/description`,
//       partners: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//       visas: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/visa-sponsorship`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
//       change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
//       new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
//     }
//   })
// }

exports.organisation_visa_sponsorship = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/organisations/visa-sponsorship', {
    organisation,
    actions: {
      // details: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/details`,
      // description: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/description`,
      // partners: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      // visas: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/visa-sponsorship`,
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

// exports.edit_accredited_body_description_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
//
//   res.render('../views/organisations/accredited-bodies/description', {
//     organisation,
//     accreditedBody,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }
//
// exports.edit_accredited_body_description_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   let accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
//   accreditedBody.description = req.session.data.accreditedBody.description
//
//   const errors = []
//
//   if (errors.length) {
//     res.render('../views/organisations/accredited-bodies/description', {
//       organisation,
//       accreditedBody,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description`,
//         back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//       },
//       errors
//     })
//   } else {
//     accreditedBodyModel.updateOne({
//       organisationId: req.params.organisationId,
//       accreditedBodyId: req.params.accreditedBodyId,
//       accreditedBody: req.session.data.accreditedBody
//     })
//
//     req.flash('success','Accredited body description updated')
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
//   }
// }

/// ------------------------------------------------------------------------ ///
/// NEW ACCREDITED BODY
/// ------------------------------------------------------------------------ //

// exports.new_accredited_body_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   let selectedAccreditedBody
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.id) {
//     selectedAccreditedBody = req.session.data.accreditedBody.id
//   }
//
//   const accreditedBodyOptions = organisationHelper.getAccreditedBodyAutocompleteOptions(selectedAccreditedBody)
//
//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }
//
//   res.render('../views/organisations/accredited-bodies/new', {
//     organisation,
//     accreditedBodyOptions,
//     selectedAccreditedBody,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
//       back,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }
//
// exports.new_accredited_body_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   let selectedAccreditedBody
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.id) {
//     selectedAccreditedBody = req.session.data.accreditedBody.id
//   }
//
//   const accreditedBodyOptions = organisationHelper.getAccreditedBodyAutocompleteOptions(selectedAccreditedBody)
//
//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }
//
//   const errors = []
//
//   // if (!selectedAccreditedBody) {
//   //   const error = {}
//   //   error.fieldName = 'accredited-body'
//   //   error.href = '#accredited-body'
//   //   error.text = 'Enter an accredited body'
//   //   errors.push(error)
//   // }
//
//   if (errors.length) {
//     res.render('../views/organisations/accredited-bodies/new', {
//       organisation,
//       accreditedBodyOptions,
//       selectedAccreditedBody,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
//         back,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//       },
//       errors
//     })
//   } else {
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`)
//   }
// }
//
// exports.new_accredited_body_description_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }
//
//   res.render('../views/organisations/accredited-bodies/description', {
//     organisation,
//     accreditedBody: req.session.data.accreditedBody,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
//       back,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }
//
// exports.new_accredited_body_description_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }
//
//   const errors = []
//
//   if (errors.length) {
//     res.render('../views/organisations/accredited-bodies/description', {
//       organisation,
//       accreditedBody: req.session.data.accreditedBody,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
//         back,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//       },
//       errors
//     })
//   } else {
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
//   }
// }
//
// exports.new_accredited_body_check_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//
//   res.render('../views/organisations/accredited-bodies/check-your-answers', {
//     organisation,
//     accreditedBody: req.session.data.accreditedBody,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
//       change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }
//
// exports.new_accredited_body_check_post = (req, res) => {
//   accreditedBodyModel.insertOne({
//     organisationId: req.params.organisationId,
//     accreditedBody: req.session.data.accreditedBody
//   })
//
//   req.flash('success','Accredited body added')
//   res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
// }

/// ------------------------------------------------------------------------ ///
/// DELETE ACCREDITED BODY
/// ------------------------------------------------------------------------ ///

// exports.delete_accredited_body_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
//
//   const courses = courseModel
//     .findMany({ organisationId: req.params.organisationId })
//     .filter(course => course.accreditedBody.id === req.params.accreditedBodyId)
//
//   const hasCourses = courses.length ? true : false
//
//   res.render('../views/organisations/accredited-bodies/delete', {
//     organisation,
//     accreditedBody,
//     hasCourses,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/delete`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }
//
// exports.delete_accredited_body_post = (req, res) => {
//   accreditedBodyModel.deleteOne({
//     organisationId: req.params.organisationId,
//     accreditedBodyId: req.params.accreditedBodyId
//   })
//
//   req.flash('success','Accredited body deleted')
//   res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
// }
