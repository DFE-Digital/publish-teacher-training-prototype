const courseModel = require('../models/courses')
const organisationModel = require('../models/organisations')
const accreditedProviderModel = require('../models/accredited-providers')
const organisationHelper = require('../helpers/organisations')
const permissionsHelper = require('../helpers/permissions')

const validationHelper = require("../helpers/validators")

exports.accredited_bodies_list = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  organisation.accreditedBodies.sort((a,b)=> {
    return a.name.localeCompare(b.name)
  })

  // clear out the session
  delete req.session.data.accreditedProvider

  res.render('../views/accredited-bodies/list', {
    organisation,
    actions: {
      new: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}`
    }
  })
}

/// ------------------------------------------------------------------------ ///
/// EDIT ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.edit_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  const wordCount = 100

  res.render('../views/accredited-bodies/description', {
    organisation,
    accreditedProvider,
    wordCount,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description?referrer=change`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.edit_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
  accreditedProvider.description = req.session.data.accreditedProvider.description

  const wordCount = 100

  const errors = []

  if (!accreditedProvider.description.length) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = 'Enter details about the accredited provider'
    errors.push(error)
  } else if (
    !validationHelper.isValidWordCount(accreditedProvider.description, wordCount)
  ) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = `Description about the accredited provider must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-bodies/description', {
      organisation,
      accreditedProvider,
      wordCount,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/description?referrer=change`,
        back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    accreditedProviderModel.updateOne({
      organisationId: req.params.organisationId,
      accreditedBodyId: req.params.accreditedBodyId,
      accreditedBody: accreditedProvider
    })

    req.flash('success', 'Accredited provider description updated')
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
  }
}

// exports.edit_accredited_body_permissions_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

//   let selectedPermissions
//   if (accreditedBody && accreditedBody.permissions) {
//     selectedPermissions = accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   res.render('../views/accredited-bodies/permissions', {
//     organisation,
//     accreditedBody,
//     permissionsOptions,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/permissions`,
//       back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }

// exports.edit_accredited_body_permissions_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
//   const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)
//   accreditedBody.permissions = req.session.data.accreditedBody.permissions

//   let selectedPermissions
//   if (accreditedBody && accreditedBody.permissions) {
//     selectedPermissions = accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   const errors = []

//   if (errors.length) {
//     res.render('../views/accredited-bodies/permissions', {
//       organisation,
//       accreditedBody,
//       permissionsOptions,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/permissions`,
//         back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//       },
//       errors
//     })
//   } else {
//     accreditedProviderModel.updateOne({
//       organisationId: req.params.organisationId,
//       accreditedBodyId: req.params.accreditedBodyId,
//       accreditedBody
//     })

//     req.flash('success', 'Accredited provider permissions updated')
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
//   }
// }

/// ------------------------------------------------------------------------ ///
/// NEW ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ //

exports.new_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  res.render('../views/accredited-bodies/new', {
    organisation,
    accreditedProvider,
    actions: {
      save,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  let save = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
  if (req.query.referrer === 'check') {
    save += '?referrer=check'
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  const errors = []

  if (!req.session.data.accreditedProvider.name.length) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = 'Enter a provider name, UKPRN or postcode'
    errors.push(error)
  } else if (
    organisationHelper.hasAccreditedProvider(
      req.params.organisationId,
      req.session.data.accreditedProvider.name
    )
  ) {
    const error = {}
    error.fieldName = 'accredited-provider'
    error.href = '#accredited-provider'
    error.text = `${req.session.data.accreditedProvider.name} has already been added`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-bodies/new', {
      organisation,
      accreditedProvider,
      actions: {
        save,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {

    // find the accredited provider details
    const accreditedProvider = organisationModel.findMany({
      isAccreditedBody: true,
      query: req.session.data.accreditedProvider.name
    })

    req.session.data.accreditedProvider.id = accreditedProvider[0].id
    req.session.data.accreditedProvider.code = accreditedProvider[0].code
    req.session.data.accreditedProvider.name = accreditedProvider[0].name

    if (req.query.referrer === 'check') {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
    } else {
      res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`)
    }
  }
}

exports.new_accredited_body_description_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  const wordCount = 100

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  res.render('../views/accredited-bodies/description', {
    organisation,
    accreditedProvider,
    wordCount,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
      back,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_description_post = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedProvider = req.session.data.accreditedProvider

  const wordCount = 100

  let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`
  if (req.query.referrer === 'check') {
    back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
  }

  const errors = []

  if (!req.session.data.accreditedProvider.description.length) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = 'Enter details about the accredited provider'
    errors.push(error)
  } else if (
    !validationHelper.isValidWordCount(req.session.data.accreditedProvider.description, wordCount)
  ) {
    const error = {}
    error.fieldName = 'accredited-provider-description'
    error.href = '#accredited-provider-description'
    error.text = `Description about the accredited provider must be ${wordCount} words or fewer`
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/accredited-bodies/description', {
      organisation,
      accreditedProvider,
      wordCount,
      actions: {
        save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
        back,
        cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
      },
      errors
    })
  } else {
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
  }
}

// exports.new_accredited_body_permissions_get = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

//   let selectedPermissions
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
//     selectedPermissions = req.session.data.accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }

//   res.render('../views/accredited-bodies/permissions', {
//     organisation,
//     accreditedBody: req.session.data.accreditedBody,
//     permissionsOptions,
//     actions: {
//       save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`,
//       back,
//       cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//     }
//   })
// }

// exports.new_accredited_body_permissions_post = (req, res) => {
//   const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

//   let selectedPermissions
//   if (req.session.data.accreditedBody && req.session.data.accreditedBody.permissions) {
//     selectedPermissions = req.session.data.accreditedBody.permissions
//   }

//   const permissionsOptions = permissionsHelper.getPermissionsOptions(selectedPermissions)

//   let back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`
//   if (req.query.referrer === 'check') {
//     back = `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`
//   }

//   const errors = []

//   if (errors.length) {
//     res.render('../views/accredited-bodies/permissions', {
//       organisation,
//       accreditedBody: req.session.data.accreditedBody,
//       permissionsOptions,
//       actions: {
//         save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/permissions`,
//         back,
//         cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
//       },
//       errors
//     })
//   } else {
//     res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`)
//   }
// }

exports.new_accredited_body_check_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })

  res.render('../views/accredited-bodies/check-your-answers', {
    organisation,
    accreditedProvider: req.session.data.accreditedProvider,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/check`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new/description`,
      change: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/new`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.new_accredited_body_check_post = (req, res) => {
  accreditedProviderModel.insertOne({
    organisationId: req.params.organisationId,
    accreditedBody: req.session.data.accreditedProvider
  })

  req.flash('success', 'Accredited provider added')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
}

/// ------------------------------------------------------------------------ ///
/// DELETE ACCREDITED PROVIDER
/// ------------------------------------------------------------------------ ///

exports.delete_accredited_body_get = (req, res) => {
  const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
  const accreditedBody = organisation.accreditedBodies.find(accreditedBody => accreditedBody.id === req.params.accreditedBodyId)

  const courses = courseModel
    .findMany({ organisationId: req.params.organisationId })
    .filter(course => course.accreditedBody.id === req.params.accreditedBodyId)

  const hasCourses = !!courses.length

  res.render('../views/accredited-bodies/delete', {
    organisation,
    accreditedBody,
    hasCourses,
    actions: {
      save: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies/${req.params.accreditedBodyId}/delete`,
      back: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`,
      cancel: `/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`
    }
  })
}

exports.delete_accredited_body_post = (req, res) => {
  accreditedProviderModel.deleteOne({
    organisationId: req.params.organisationId,
    accreditedBodyId: req.params.accreditedBodyId
  })

  req.flash('success', 'Accredited provider deleted')
  res.redirect(`/organisations/${req.params.organisationId}/cycles/${req.params.cycleId}/accredited-bodies`)
}

/// ------------------------------------------------------------------------ ///
/// ACCREDITED PROVIDER SUGGESTIONS FOR AUTOCOMPLETE
/// ------------------------------------------------------------------------ ///

exports.accredited_provider_suggestions_json = (req, res) => {
  req.headers['Access-Control-Allow-Origin'] = true

  let providers
  providers = organisationModel.findMany({
    isAccreditedBody: true,
    query: req.query.query
  })

  providers.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  res.json(providers)
}
